import { ILDOptionsMapStatePart } from "../store";
import { ILDOptions } from "ldaccess/ildoptions";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { ActionsObservable } from "redux-observable";
import { Observable } from 'rxjs/Rx';
import { IKvStore } from "ldaccess/ikvstore";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { LDDict } from "ldaccess/LDDict";
import { UserDefDict } from "ldaccess/UserDefDict";
import { isObjPropertyRef, ldBlueprintCfgDeepCopy } from "ldaccess/ldUtils";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { ITPT_REFMAP_BASE } from "ldaccess/iinterpreter-retriever";
import { refMapBaseTokenStr, ILDToken, NetworkPreferredToken, createConcatNetworkPreferredToken } from "ldaccess/ildtoken";
import { appItptMatcherFn } from "appconfig/appInterpreterMatcher";
//import { appItptMatcherFn } from "appconfig/appInterpreterMatcher";

/**
 * a duck for ReferenceMap-handling.
 * Note: No epic has been added yet
 */

export const REFMAP_REQUEST = 'shnyder/REFMAP_REQUEST'; //fills all static/non-ObjProp, nonldTkStrngRef,
export const REFMAP_SUCCESS = 'shnyder/REFMAP_SUCCESS';

export type RefMapAction =
	{ type: 'shnyder/REFMAP_REQUEST', ldOptionsBase: ILDOptions, refMap: BlueprintConfig }
	| { type: 'shnyder/REFMAP_SUCCESS', ldOptionsBase: ILDOptions };

//Action factories, return action Objects
export const refMapREQUESTAction = (updatedLDOptions: ILDOptions, refMap: BlueprintConfig): RefMapAction => (
	{ type: REFMAP_REQUEST, ldOptionsBase: updatedLDOptions, refMap }
);

export const refMapSUCCESSAction = (updatedLDOptions: ILDOptions): RefMapAction => (
	{ type: REFMAP_SUCCESS, ldOptionsBase: updatedLDOptions }
);

export const refMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: RefMapAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case REFMAP_REQUEST:
			let baseRefMap: BlueprintConfig = action.refMap;
			let ldOptionsBase = action.ldOptionsBase;
			let isRefMapNeedsUpdate: boolean = true;
			//make sure the creation algorithm only runs once
			/*if (ldOptionsBase.visualInfo.interpretedBy) {
				if (action.refMap.nameSelf !== ldOptionsBase.visualInfo.interpretedBy) {
					isRefMapNeedsUpdate = true;
				} else {
					isRefMapNeedsUpdate = false;
				}
			} else {
				isRefMapNeedsUpdate = true;
			}*/
			if (isRefMapNeedsUpdate) {
				/*let ldOptionsRefMapIdx = ldOptionsBase.resource.kvStores.findIndex((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
				if (ldOptionsRefMapIdx) {
					ldOptionsBase.resource.kvStores.splice(ldOptionsRefMapIdx, 1);
				}*/
				//makes sure a copy of the RefMap-KV exists in the ILDOptions-Object (basically pushes itpt-declaration
				// to runtime-model, while making sure the declaration isn't changed by being used)
				let stateCopy = { ...state };
				let modBPCfg: BlueprintConfig = ldBlueprintCfgDeepCopy(action.refMap);
				stateCopy = createRuntimeRefMapLinks(stateCopy, modBPCfg, ldOptionsBase);
				stateCopy = assignValuesToRuntimeRefMap(stateCopy, modBPCfg, ldOptionsBase);
				ldOptionsBase.resource.kvStores.unshift(modBPCfg.initialKvStores.
					find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType));
				stateCopy[ldOptionsBase.ldToken.get()] = ldOptionsBase;
				return stateCopy;
			} else {
				return state;
			}
		//throw new Error("not implemented, interpret RefMaps recursively. Build functions" +
		//	" for each part of a BlueprintConfig, so that creation and deletion can use the same traversal");
		//return state;
		case REFMAP_SUCCESS:
			return state;
		default:
			break;
	}
	return state;
};

const createRuntimeRefMapLinks: RefMapIteratorFn<ILDOptionsMapStatePart> = (
	modifiedObj: ILDOptionsMapStatePart,
	rmBPCfg: BlueprintConfig,
	ldOptions: ILDOptions
) => {
	let { subItptOf, canInterpretType, nameSelf } = rmBPCfg;
	let ldTkStr = ldOptions.ldToken.get();
	let ldBaseTokenStr = refMapBaseTokenStr(ldTkStr);
	//RefMaps have only one base, but are stored under individual ids. This will rename the base at runtime, for easier access
	rmBPCfg.interpretableKeys.forEach((a) => {
		if (isObjPropertyRef(a)) {
			let aAsOPR: ObjectPropertyRef = a as ObjectPropertyRef;
			if (aAsOPR.objRef === subItptOf) {
				aAsOPR.objRef = ldBaseTokenStr;
			} else {
				aAsOPR.objRef = createConcatNetworkPreferredToken(ldTkStr, aAsOPR.objRef).get();
			}
		}
	});
	let rmKv: IKvStore = rmBPCfg.initialKvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			//create links on refMap-Copy
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			rmSubCfg.initialKvStores.forEach((b) => {
				if (isObjPropertyRef(b.value)) {
					let aAsOPR: ObjectPropertyRef = b.value as ObjectPropertyRef;
					if (aAsOPR.objRef === subItptOf) {
						aAsOPR.objRef = ldBaseTokenStr;
					} else {
						aAsOPR.objRef = createConcatNetworkPreferredToken(ldTkStr, aAsOPR.objRef).get();
					}
				}
			});
		}
	}
	rmKv.value[ITPT_REFMAP_BASE] = rmKv.value[subItptOf];
	delete rmKv.value[subItptOf];
	return modifiedObj;
};

const assignValuesToRuntimeRefMap: RefMapIteratorFn<ILDOptionsMapStatePart> = (
	modifiedObj: ILDOptionsMapStatePart,
	rmBPCfg: BlueprintConfig,
	ldOptions: ILDOptions
) => {
	let rmKv: IKvStore = rmBPCfg.initialKvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	let ldTkStr = ldOptions.ldToken.get();
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			//create runtime-objects
			let rtNewToken: ILDToken = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey);
			let rtNewTkStr: string = rtNewToken.get();
			let rtLDOptions: ILDOptions = {
				lang: ldOptions.lang,
				isLoading: false,
				ldToken: rtNewToken,
				visualInfo: { retriever: ldOptions.visualInfo.retriever, interpretedBy: rmSubCfgKey },
				resource: { webInResource: null, webOutResource: null, kvStores: rmSubCfg.initialKvStores }
			};
			modifiedObj[rtNewTkStr] = rtLDOptions;
		}
	}
	let { interpretableKeys, initialKvStores } = rmBPCfg;
	//let modRefMapKV: IKvStore = rmBPCfg.initialKvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	interpretableKeys.forEach((singleIntrpblKey) => {
		if (isObjPropertyRef(singleIntrpblKey)) {
			//property on another BPConfig
			let sKeyAsObjPropRef: ObjectPropertyRef = singleIntrpblKey as ObjectPropertyRef;
			let propName: string = sKeyAsObjPropRef.propRef;
			let ldTkStr: string = sKeyAsObjPropRef.objRef;
			let actualInputKv: IKvStore = ldOptions.resource.kvStores.find((a) => a.key === propName);
			if (!actualInputKv) return;
			let propIdx = modifiedObj[ldTkStr].resource.kvStores.findIndex((b) => b.key === propName);
			if (propIdx === -1) {
				modifiedObj[ldTkStr].resource.kvStores.unshift(actualInputKv);
			} else {
				modifiedObj[ldTkStr].resource.kvStores.splice(propIdx, 1, actualInputKv);
			}
		} else {
			//is string, property on this BPConfig
		}
	});
	return modifiedObj;
};
/*
const itptRefMapTypeRMReqFn: RefMapIteratorFn<ILDOptionsMapStatePart> = (
	modifiedObj: ILDOptionsMapStatePart,
	rmBPCfg: BlueprintConfig,
	ldOptions: ILDOptions
) => {
	let rmKvVal: { [s: string]: BlueprintConfig } = originalRefMapKv.value;
	for (const rmSubCfgKey in rmKvVal) {
		if (rmKvVal.hasOwnProperty(rmSubCfgKey)) {
			const rmSubCfg = rmKvVal[rmSubCfgKey];

		}
	}
	return modifiedObj;
};*/

type RefMapIteratorFn<T> = (modifiedObj: T, rmBPCfg: BlueprintConfig, ldOptions: ILDOptions) => T;
/*
function traverseRefMap<MO>(
	modifiedObj: MO,
	rmBPCfg: BlueprintConfig,
	topLayerFn: RefMapIteratorFn<MO>,
	ioSigFn: RefMapIteratorFn<MO>,
	refMapFN: RefMapIteratorFn<MO>,
	ldOptions: ILDOptions): MO {
	let rv: MO = topLayerFn(modifiedObj, rmBPCfg, ldOptions);
	let refMapKV: IKvStore = rmBPCfg.initialKvStores && rmBPCfg.initialKvStores.length > 0
		? rmBPCfg.initialKvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType)
		: null;
	rv = ioSigFn(modifiedObj, rmBPCfg, ldOptions);
	rv = refMapKV ? refMapFN(modifiedObj, rmBPCfg, ldOptions) : rv;
	return rv;
	}*/

/*
function assignDerivedItpt(retriever: string, newLDTokenStr: string, bpCfg: BlueprintConfig, ldOptions: ILDOptions): void {
	let baseItpt = appItptMatcherFn().getItptRetriever(retriever).getItptByNameSelf(bpCfg.nameSelf);
	let wrappedItpt = ldBlueprint(bpCfg)(baseItpt);
	appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(newLDTokenStr, wrappedItpt);
}*/

export const refMapEpic = (action$: ActionsObservable<any>, store: any) => {
	return action$.ofType(REFMAP_REQUEST)
		.do(() => console.log("REQUESTing Refmap Async part (itpt-retrieval)"))
		.mergeMap((action) => {
			let ldOptionsObj: ILDOptions = action.ldOptionsBase;
			let baseRefMap: BlueprintConfig = action.refMap;
			let refMapREQUESTPromise = new Promise((resolve, reject) => {
				createInterpreters(ldOptionsObj);
				ldOptionsObj.isLoading = false;
				resolve(ldOptionsObj);
			});
			let rv = Observable.from(refMapREQUESTPromise);
			return rv.map((ldOptions: ILDOptions) => (
				refMapSUCCESSAction(ldOptions)
			));
		});
};

const createInterpreters = (
	ldOptions: ILDOptions
) => {
	//TODO: recursive config-desintegration and traversal here, assigning of FULL derived interpreters
	let { retriever, interpretedBy } = ldOptions.visualInfo;
	let itptRetriever = appItptMatcherFn().getItptRetriever(retriever);
	let ldTkStr = ldOptions.ldToken.get();
	let rmKv = ldOptions.resource.kvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	let rmKvVal = rmKv.value;
	for (const rmSubCfgKey in rmKvVal) {
		if (rmKvVal.hasOwnProperty(rmSubCfgKey)) {
			const concatNWTkStr = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey).get();
			const subCfg = rmKvVal[rmSubCfgKey];
			let itpt = itptRetriever.getItptByNameSelf(subCfg.subItptOf);
			itpt = ldBlueprint(subCfg)(itpt);
			itptRetriever.setDerivedItpt(concatNWTkStr, itpt);
		}
	}
	return;
};
