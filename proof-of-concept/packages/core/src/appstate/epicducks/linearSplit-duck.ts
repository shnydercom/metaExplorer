import { ILDOptionsMapStatePart } from "../store";
import { ILDOptions } from "../../ldaccess/ildoptions";
import { linearLDTokenStr, NetworkPreferredToken, ILDToken } from "../../ldaccess/ildtoken";
import { appItptMatcherFn } from "../../appconfig/appItptMatcher";
import { ActionsObservable, ofType } from "redux-observable";
import { from } from 'rxjs';
import { ReduxItptRetriever } from "../../ld-react-redux-connect/ReduxItptRetriever";
import { OutputKVMap, OutputKVMapElement } from "../../ldaccess/ldBlueprint";
import { KVL } from "../../ldaccess/KVL";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { mergeMap, map } from "rxjs/operators";
import { isObjPropertyRef, ObjectPropertyRef } from "../../ldaccess";
import { ExplorerState } from "..";

/**
 * a duck for linear state splitting, used for containers
 */

export const LINEAR_SPLIT_REQUEST = 'metaexplorer.io/LINEAR_SPLIT_REQUEST';
export const LINEAR_SPLIT_SUCCESS = 'metaexplorer.io/LINEAR_SPLIT_SUCCESS';

export type LinearSplitAction = { type: 'metaexplorer.io/LINEAR_SPLIT_REQUEST', ldOptionsBase: ILDOptions }
	| { type: 'metaexplorer.io/LINEAR_SPLIT_SUCCESS', ldOptionsBase: ILDOptions };
//Action factories, return action Objects

export const linearSplitRequestAction = (updatedLDOptions: ILDOptions): LinearSplitAction => ({ type: LINEAR_SPLIT_REQUEST, ldOptionsBase: updatedLDOptions });
export const linearSplitSuccessAction = (updatedLDOptions: ILDOptions): LinearSplitAction => ({ type: LINEAR_SPLIT_SUCCESS, ldOptionsBase: updatedLDOptions });

export const linearReducer = (
	state: ILDOptionsMapStatePart = {}, action: LinearSplitAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case LINEAR_SPLIT_REQUEST:
			let ldOptionsBase = action.ldOptionsBase;
			let ldTkStr = action.ldOptionsBase.ldToken.get();
			if (ldOptionsBase.isLoading) return state;
			let stateCopy = { ...state };
			removePrevSplit(stateCopy, ldTkStr);
			splitValues(stateCopy, action);
			ldOptionsBase.isLoading = true;
			stateCopy[ldTkStr] = ldOptionsBase;
			return stateCopy;
		default:
			break;
	}
	return state;
};

function removePrevSplit(stateCopy: ILDOptionsMapStatePart, ldTkStr: string) {
	let kvStores = stateCopy[ldTkStr].resource.kvStores;
	kvStores.forEach((itm, idx) => {
		stateCopy[linearLDTokenStr(ldTkStr, idx)] = undefined;
	});
}

function splitValues(stateCopy: ILDOptionsMapStatePart, action: LinearSplitAction) {
	let ldOptionsObj = action.ldOptionsBase;
	let ldTkStr = ldOptionsObj.ldToken.get();
	let lang = ldOptionsObj.lang;
	let retriever = ldOptionsObj.visualInfo.retriever;
	let keyIdxMap: Map<string, number> = new Map();
	let rootOKV: OutputKVMap = {};
	ldOptionsObj.resource.kvStores.forEach((itm, idx) => {
		const elemKey = itm.key;
		keyIdxMap.set(elemKey, idx);
		let newLDTokenStr: string = linearLDTokenStr(ldTkStr, idx);
		let newLDToken = new NetworkPreferredToken(newLDTokenStr);
		let targetLDToken: ILDToken = new NetworkPreferredToken(ldTkStr);
		if (itm.ldType === UserDefDict.outputKVMapType || itm.key === UserDefDict.outputKVMapKey) {
			//TODO: if an outputKvMap exists in the list of kvStores to split, then look for the right value and modify
			//the okvmap on that KVL
			const splitOKV: OutputKVMap = itm.value;
			for (const okvElemStr in splitOKV) {
				if (splitOKV.hasOwnProperty(okvElemStr)) {
					let okvElem = splitOKV[okvElemStr];
					let targetProp = okvElem[0].targetProperty;
					let curSC = stateCopy[linearLDTokenStr(ldTkStr, keyIdxMap.get(targetProp))];
					//besser ist es, beim itererieren eine map mit den Indices der Positionen zu erstellen, und dann aus dem State
					//sich stateCopy[token + "-l" + idx] zu holen
					let outputKvMaps = curSC.resource.kvStores.filter((val) => val.key === UserDefDict.outputKVMapKey);
					let newOutputKvMapInStore: OutputKVMap = { [okvElemStr]: [{ targetLDToken: targetLDToken, targetProperty: targetProp }] };
					if (outputKvMaps.length === 0) {
						let newOKVStoreInStore: KVL = { key: UserDefDict.outputKVMapKey, value: newOutputKvMapInStore, ldType: UserDefDict.outputKVMapType };
						curSC.resource.kvStores.push(newOKVStoreInStore);
					} else {
						outputKvMaps[0].value = newOutputKvMapInStore;
					}
				}
			}
			return;
		} else {
			//build okvMapElement on the root:
			const newOKVElem: OutputKVMapElement = { targetLDToken: newLDToken, targetProperty: elemKey };
			rootOKV[elemKey] = [newOKVElem];
		}
		let newOutputKvMap: OutputKVMap = { [elemKey]: [{ targetLDToken: targetLDToken, targetProperty: elemKey }] };
		let newOKVStore: KVL = { key: UserDefDict.outputKVMapKey, value: newOutputKvMap, ldType: UserDefDict.outputKVMapType };
		let newLDOptions: ILDOptions = {
			isLoading: false,
			lang: lang,
			ldToken: newLDToken,
			visualInfo: { retriever: retriever },
			resource: {
				webInResource: null,
				webOutResource: null,
				kvStores: [itm, newOKVStore]
			}
		};
		stateCopy[newLDToken.get()] = newLDOptions;
	});
	const rootOKVStore: KVL = { key: UserDefDict.outputKVMapKey, value: rootOKV, ldType: UserDefDict.outputKVMapType };
	const rootKVLidx = ldOptionsObj.resource.kvStores.findIndex((itm) => (itm.ldType === UserDefDict.outputKVMapType || itm.key === UserDefDict.outputKVMapKey));
	if (rootKVLidx >= 0) {
		ldOptionsObj.resource.kvStores[rootKVLidx] = rootOKVStore;
	} else {
		ldOptionsObj.resource.kvStores.push(rootOKVStore);
	}
}

function assignDerivedItpt(retriever: string, newLDTokenStr: string, ldType: string, crudSkills: string): void {
	(appItptMatcherFn().getItptRetriever(retriever) as ReduxItptRetriever).searchForObjItptAndDerive(ldType, crudSkills, newLDTokenStr);
}

export function clearDerivedItpt(retriever: string, oldLDTokenStr: string) {
	//TODO: implement peakAhead-Algorithm to remove all ...-l[0..n] ldTokenStrings
	if (appItptMatcherFn().getItptRetriever(retriever).hasDerivedItpt(oldLDTokenStr)) {
		appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(oldLDTokenStr, null);
	}
}

export const linearSplitEpic = (action$: ActionsObservable<any>, store: any) => {
	return action$.pipe(
		ofType(LINEAR_SPLIT_REQUEST),
		mergeMap(
			(action) => {
				if (!action.ldOptionsBase) return undefined;
				let ldOptionsObj = action.ldOptionsBase;
				let retriever = action.ldOptionsBase.visualInfo.retriever;
				let ldTkStr = action.ldOptionsBase.ldToken.get();
				let splitReqPromise = new Promise((resolve, reject) => {
					ldOptionsObj.resource.kvStores.forEach((itm, idx) => {
						let newLDTokenStr: string = linearLDTokenStr(ldTkStr, idx);
						let searchTerm: string = itm.ldType;
						if (!itm.ldType && isObjPropertyRef(itm.value)) {
							const locObjPropRef: ObjectPropertyRef = itm.value;
							const searchRef = (store.value as ExplorerState).ldoptionsMap[locObjPropRef.objRef].resource.kvStores.find((kvl) => kvl.key === locObjPropRef.propRef);
							if (!searchRef) return;
							searchTerm = searchRef.ldType;
						}
						assignDerivedItpt(retriever, newLDTokenStr, searchTerm, "cRud");
					});
					ldOptionsObj.isLoading = false;
					resolve(ldOptionsObj);
				});
				let rv = from(splitReqPromise);
				return rv.pipe(
					map((ldOptions: ILDOptions) => (
						linearSplitSuccessAction(ldOptions)
					)));
			}
		)
	);
};
