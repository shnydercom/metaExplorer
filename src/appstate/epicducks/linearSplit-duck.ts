import { ILDOptionsMapStatePart } from "../store";
import { ILDOptions } from "ldaccess/ildoptions";
import { LDAction } from "./ldOptions-duck";
import { linearLDTokenStr, NetworkPreferredToken, ILDToken } from "ldaccess/ildtoken";
import { isLDOptionsSame } from "ldaccess/ldUtils";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { ActionsObservable } from "redux-observable";
import { Observable } from 'rxjs/Rx';
import { LDError, LDErrorMsgState } from "../LDError";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";
import { OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { LDDict } from "ldaccess/LDDict";
import { UserDefDict } from "ldaccess/UserDefDict";

/**
 * a duck for linear state splitting, used for containers
 */

export const LINEAR_SPLIT_REQUEST = 'shnyder/LINEAR_SPLIT_REQUEST';
export const LINEAR_SPLIT_SUCCESS = 'shnyder/LINEAR_SPLIT_SUCCESS';

export type LinearSplitAction = { type: 'shnyder/LINEAR_SPLIT_REQUEST', ldOptionsBase: ILDOptions }
	| { type: 'shnyder/LINEAR_SPLIT_SUCCESS', ldOptionsBase: ILDOptions };
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
	ldOptionsObj.resource.kvStores.forEach((itm, idx) => {
		const elemKey = itm.key;
		let newLDTokenStr: string = linearLDTokenStr(ldTkStr, idx);
		let newLDToken = new NetworkPreferredToken(newLDTokenStr);
		//assignDerivedItpt(retriever, newLDTokenStr, itm.ldType, "cRud");
		let targetLDToken: ILDToken = new NetworkPreferredToken(ldTkStr);
		let newOutputKvMap: OutputKVMap = { [elemKey]: [{ targetLDToken: targetLDToken, targetProperty: elemKey }] };
		let newOKVStore: IKvStore = { key: UserDefDict.outputKVMapKey, value: newOutputKvMap, ldType: UserDefDict.outputKVMapType };
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
}

function assignDerivedItpt(retriever: string, newLDTokenStr: string, ldType: string, crudSkills: string): void {
	(appItptMatcherFn().getItptRetriever(retriever) as ReduxItptRetriever).searchForObjItptAndDerive(ldType, crudSkills, newLDTokenStr);
	//let baseItpt = appItptMatcherFn().getItptRetriever(retriever).searchForObjItpt(ldType, crudSkills);
	//appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(newLDTokenStr, baseItpt);
}

function clearDerivedItpt(retriever: string, oldLDTokenStr: string) {
	//TODO: implement peakAhead-Algorithm to remove all ...-l[0..n] ldTokenStrings
	if (appItptMatcherFn().getItptRetriever(retriever).hasDerivedItpt(oldLDTokenStr)) {
		appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(oldLDTokenStr, null);
	}
}

export const linearSplitEpic = (action$: ActionsObservable<any>, store: any) => {
	return action$.ofType(LINEAR_SPLIT_REQUEST)
		/*.do(() => console.log("after splitting LDOptions generate Retrievers/Matchers"))*/
		.mergeMap((action) => {
			if (!action.ldOptionsBase) return;
			let ldOptionsObj = action.ldOptionsBase;
			let retriever = action.ldOptionsBase.visualInfo.retriever;
			let ldTkStr = action.ldOptionsBase.ldToken.get();
			let splitReqPromise = new Promise((resolve, reject) => {
				//TOdo: check if it's needed:
				// clearDerivedItpt(retriever, ldTkStr);
				ldOptionsObj.resource.kvStores.forEach((itm, idx) => {
					let newLDTokenStr: string = linearLDTokenStr(ldTkStr, idx);
					let newLDToken = new NetworkPreferredToken(newLDTokenStr);
					assignDerivedItpt(retriever, newLDTokenStr, itm.ldType, "cRud");
				});
				ldOptionsObj.isLoading = false;
				// assignDerivedItpt(retriever, ldTkStr, UserDefDict.itptContainerObjType, "cRud");
				resolve(ldOptionsObj);
			});
			let rv = Observable.from(splitReqPromise);
			return rv.map((ldOptions: ILDOptions) => (
				linearSplitSuccessAction(ldOptions)
			));
		}
		);
};
