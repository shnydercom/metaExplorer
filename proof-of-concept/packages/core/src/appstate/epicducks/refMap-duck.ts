import { ILDOptionsMapStatePart, ExplorerState } from "../store";
import { ILDOptions } from "../../ldaccess/ildoptions";
import { ldBlueprint, BlueprintConfig, OutputKVMap, OutputKVMapElement } from "../../ldaccess/ldBlueprint";
import { ActionsObservable, ofType } from "redux-observable";
import { of } from 'rxjs';
import { KVL } from "../../ldaccess/KVL";
import { ObjectPropertyRef } from "../../ldaccess/ObjectPropertyRef";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { isObjPropertyRef, ldBlueprintCfgDeepCopy } from "../../ldaccess/ldUtils";
import { ITPT_REFMAP_BASE } from "../../ldaccess/iitpt-retriever";
import { refMapBaseTokenStr, ILDToken, NetworkPreferredToken, createConcatNetworkPreferredToken } from "../../ldaccess/ildtoken";
import { appItptMatcherFn } from "../../appconfig/appItptMatcher";
import { ReduxItptRetriever } from "../../ld-react-redux-connect/ReduxItptRetriever";
import { Store } from "redux";
import { isReactComponent } from "../../components/reactUtils/reactUtilFns";
import { connectNonVisLDComp } from "../../sidefx/nonVisualConnect";

import { concat as concat$ } from 'rxjs';
import { mergeMap } from "rxjs/operators";
import { LDOPTIONS_KV_UPDATE, LD_KVUpdateAction } from "./ldOptions-duck";

/**
 * a duck for ReferenceMap-handling.
 * Note: No epic has been added yet
 */

export const REFMAP_REQUEST = 'metaexplorer.io/REFMAP_REQUEST'; //fills all static/non-ObjProp, nonldTkStrngRef,
export const REFMAP_SUCCESS = 'metaexplorer.io/REFMAP_SUCCESS';

export type RefMapRequestAction = { type: 'metaexplorer.io/REFMAP_REQUEST', ldOptionsBase: ILDOptions, refMap: BlueprintConfig };
export type RefMapSuccessAction = { type: 'metaexplorer.io/REFMAP_SUCCESS', ldOptionsBase: ILDOptions };
export type RefMapAction = RefMapRequestAction | RefMapSuccessAction | LD_KVUpdateAction;

//Action factories, return action Objects
export const refMapREQUESTAction = (updatedLDOptions: ILDOptions, refMap: BlueprintConfig): RefMapAction => (
	{ type: REFMAP_REQUEST, ldOptionsBase: updatedLDOptions, refMap }
);

export const refMapSUCCESSAction = (updatedLDOptions: ILDOptions): RefMapAction => (
	{ type: REFMAP_SUCCESS, ldOptionsBase: updatedLDOptions }
);

export const refMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: RefMapAction): ILDOptionsMapStatePart => {
	let ldOptionsBase: ILDOptions = null;
	let stateCopy: ILDOptionsMapStatePart = null;
	switch (action.type) {
		case REFMAP_REQUEST:
			// let baseRefMap: BlueprintConfig = action.refMap;
			ldOptionsBase = action.ldOptionsBase;
			ldOptionsBase.isLoading = true;
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
				//makes sure a copy of the RefMap-KV exists in the ILDOptions-Object (basically pushes itpt-declaration
				// to runtime-model, while making sure the declaration isn't changed by being used)
				stateCopy = { ...state };
				let modBPCfg: BlueprintConfig = ldBlueprintCfgDeepCopy(action.refMap);
				stateCopy = createRuntimeRefMapLinks(stateCopy, modBPCfg, ldOptionsBase);
				stateCopy = assignValuesToRuntimeRefMap(stateCopy, modBPCfg, ldOptionsBase);
				stateCopy = assignOutputKvMaps(stateCopy, modBPCfg, ldOptionsBase);
				const preExistingRMKVidx = ldOptionsBase.resource.kvStores.findIndex((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
				const rmKvToAdd = modBPCfg.ownKVLs.
					find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
				if (preExistingRMKVidx === -1) {
					ldOptionsBase.resource.kvStores.unshift(rmKvToAdd);
				} else {
					ldOptionsBase.resource.kvStores.splice(preExistingRMKVidx, 1, rmKvToAdd);
				}
				stateCopy[ldOptionsBase.ldToken.get()] = ldOptionsBase;
				return stateCopy;
			} else {
				return state;
			}
		case REFMAP_SUCCESS:
			stateCopy = { ...state };
			ldOptionsBase = action.ldOptionsBase;
			//ldOptionsBase.isLoading = false;
			stateCopy[ldOptionsBase.ldToken.get()] = ldOptionsBase;
			return stateCopy;
		case LDOPTIONS_KV_UPDATE:
			let stateCopyUpd = { ...state };
			let { changedKvStores, updatedKvMap } = action;
			changedKvStores.forEach((cKvStore) => {
				let updElem = updatedKvMap[cKvStore.key];
				if (updElem) {
					updElem.forEach((objPropRef) => {
						const targetLDTkStr = objPropRef.targetLDToken.get();
						const refMapIdx = stateCopyUpd[targetLDTkStr].resource.kvStores.findIndex((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
						if (refMapIdx !== -1) {
							const refMapKv = stateCopyUpd[targetLDTkStr].resource.kvStores[refMapIdx];
							for (const rmElem in refMapKv.value) {
								if (refMapKv.value.hasOwnProperty(rmElem)) {
									const bpCfgElem: BlueprintConfig = refMapKv.value[rmElem];
									for (let idx = 0; idx < bpCfgElem.inKeys.length; idx++) {
										const itptKeyItm = bpCfgElem.inKeys[idx];
										if (itptKeyItm === objPropRef.targetProperty) {
											/*if (isObjPropertyRef(bpCfgElem.ownKVLs[idx].value)) {
												if ((bpCfgElem.ownKVLs[idx].value as ObjectPropertyRef).objRef === thisLdTkStr) {*/
											const subElementTkStr: string = createConcatNetworkPreferredToken(targetLDTkStr, rmElem).get();
											let propIdx = stateCopyUpd[subElementTkStr].resource.kvStores.findIndex((ikv) => ikv.key === itptKeyItm);
											let newInputKv: KVL = {
												key: itptKeyItm,
												value: cKvStore.value,
												ldType: cKvStore.ldType
											};
											stateCopyUpd[subElementTkStr].resource.kvStores.splice(propIdx, 1, newInputKv);
											break;
										}
										/*}
									}*/
									}
								}
							}
							let updBPCfg: BlueprintConfig = refMapKv.value[ITPT_REFMAP_BASE];
							updBPCfg = ldBlueprintCfgDeepCopy(updBPCfg);
							updBPCfg.ownKVLs.push({
								key: UserDefDict.intrprtrBPCfgRefMapKey,
								ldType: UserDefDict.intrprtrBPCfgRefMapType,
								value: updBPCfg
							});
							// ldBlueprintCfgDeepCopy(refMap as any); //.value[ITPT_REFMAP_BASE]);
							stateCopyUpd = assignValuesToRuntimeRefMap(stateCopyUpd, updBPCfg, stateCopyUpd[targetLDTkStr]);
						}
					});
				}
			});
			return stateCopyUpd;
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
	let { subItptOf } = rmBPCfg;
	let ldTkStr = ldOptions.ldToken.get();
	let ldBaseTokenStr = refMapBaseTokenStr(ldTkStr);
	//RefMaps have only one base, but are stored under individual ids. This will rename the base at runtime, for easier access
	rmBPCfg.inKeys.forEach((a) => {
		if (isObjPropertyRef(a)) {
			let aAsOPR: ObjectPropertyRef = a as ObjectPropertyRef;
			if (aAsOPR.objRef === subItptOf) {
				aAsOPR.objRef = ldBaseTokenStr;
			} else {
				aAsOPR.objRef = createConcatNetworkPreferredToken(ldTkStr, aAsOPR.objRef).get();
			}
		}
	});
	let rmKv: KVL = rmBPCfg.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	if (!rmKv) {
		console.error("no RefMap found: " + rmBPCfg.canInterpretType);
	}
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			//create links on refMap-Copy
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			rmSubCfg.ownKVLs.forEach((b) => {
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
	let rmKv: KVL = rmBPCfg.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	let ldTkStr = ldOptions.ldToken.get();
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			//create runtime-objects
			let rtNewToken: ILDToken = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey);
			let rtNewTkStr: string = rtNewToken.get();
			let newInterpretedby: string = rmSubCfgKey === ITPT_REFMAP_BASE ? rmSubCfg.nameSelf : rmSubCfgKey;
			let rtLDOptions: ILDOptions = {
				lang: ldOptions.lang,
				isLoading: false,
				ldToken: rtNewToken,
				visualInfo: { retriever: ldOptions.visualInfo.retriever, interpretedBy: newInterpretedby },
				resource: { webInResource: null, webOutResource: null, kvStores: rmSubCfg.ownKVLs }
			};
			modifiedObj[rtNewTkStr] = rtLDOptions;
		}
	}
	let { inKeys } = rmBPCfg;
	//let modRefMapKV: KVL = rmBPCfg.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	inKeys.forEach((singleIntrpblKey) => {
		if (isObjPropertyRef(singleIntrpblKey)) {
			//property on another BPConfig
			let sKeyAsObjPropRef: ObjectPropertyRef = singleIntrpblKey as ObjectPropertyRef;
			let propName: string = sKeyAsObjPropRef.propRef;
			let stateLdTkStr: string = sKeyAsObjPropRef.objRef;
			let kvs = ldOptions.resource.kvStores;
			let actualInputIdx = kvs.findIndex((a) => a.key === propName);
			if (actualInputIdx === -1) return;
			let lastActualInputIdx = actualInputIdx + 1;
			//if handing over multiple kvStores with the same field, they'll be grouped together
			while (kvs.length - 1 >= lastActualInputIdx && kvs[lastActualInputIdx].key === propName) {
				lastActualInputIdx++;
			}
			let actualInputKv: KVL[] = kvs.slice(actualInputIdx, lastActualInputIdx);
			if (!actualInputKv) return;
			let targetKvStores = modifiedObj[stateLdTkStr].resource.kvStores;
			let propIdx = targetKvStores.findIndex((b) => b.key === propName);
			if (propIdx === -1) {
				targetKvStores.unshift(...actualInputKv);
			} else {
				//same here for replacing group of kvs on the target
				let lastPropIdx = propIdx + 1;
				while (targetKvStores.length - 1 >= lastPropIdx && targetKvStores[lastPropIdx].key === propName) {
					lastPropIdx++;
				}
				targetKvStores.splice(propIdx, propIdx - lastPropIdx, ...actualInputKv);
			}
		} else {
			//is string, property on this BPConfig
		}
	});
	return modifiedObj;
};

const assignOutputKvMaps: RefMapIteratorFn<ILDOptionsMapStatePart> = (
	modifiedObj: ILDOptionsMapStatePart,
	rmBPCfg: BlueprintConfig,
	ldOptions: ILDOptions
) => {
	//let nonRmKv: KVL[] = rmBPCfg.ownKVLs.filter((a) => a.ldType !== UserDefDict.intrprtrBPCfgRefMapType);
	let rmKv: KVL = rmBPCfg.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
	let ldTkStr = ldOptions.ldToken.get();
	const okvmMap: Map<string, OutputKVMap> = new Map();
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			const concatNWTk = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey);
			const concatNWTkStr = concatNWTk.get();
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			let targetLDToken: ILDToken = new NetworkPreferredToken(concatNWTkStr);
			//let outputKVs: OutputKVMap = {};
			rmSubCfg.ownKVLs.forEach((kv) => {
				const iKey = rmSubCfg.inKeys.find((a) => a === kv.key);
				const iKeyStr: string = iKey as string;
				if (!iKeyStr) return;
				if (!isObjPropertyRef(kv.value)) return;
				const srcObjPropRef: ObjectPropertyRef = kv.value as ObjectPropertyRef;
				const srcObjRef: string = srcObjPropRef.objRef;
				if (!okvmMap.has(srcObjRef)) {
					okvmMap.set(srcObjRef, {});
				}
				let outputElem = okvmMap.get(srcObjRef)[srcObjPropRef.propRef];
				const newOutputElem = { targetLDToken: targetLDToken, targetProperty: iKeyStr };
				if (outputElem) {
					outputElem.push(newOutputElem);
				} else {
					okvmMap.get(srcObjRef)[srcObjPropRef.propRef] = [newOutputElem];
				}
			});
		}
	}
	//let rmIterator: number = 0;
	rmBPCfg.ownKVLs.forEach((kvStore, idx) => {
		if ((kvStore.ldType === UserDefDict.intrprtrBPCfgRefMapType)
			|| !isObjPropertyRef(kvStore.value)) {
			//	rmIterator++;
			return;
		}
		const kvAsObjPropRef: ObjectPropertyRef = kvStore.value as ObjectPropertyRef;
		let refString = "";
		//let newToken: NetworkPreferredToken = null;
		/*		if ((idx - rmIterator < rmBPCfg.inKeys.length)
					&& (rmBPCfg.inKeys[idx - rmIterator] === kvStore.key)) {*/
		if (rmKv.value.rmb.nameSelf === kvAsObjPropRef.objRef) {
			refString = refMapBaseTokenStr(ldTkStr);
			//	newToken = new NetworkPreferredToken(refString);
		} else {
			const concatNWTk = createConcatNetworkPreferredToken(ldTkStr, kvAsObjPropRef.objRef);
			refString = concatNWTk.get();
			//	newToken = concatNWTk;
		}
		const ldOKV = ldOptions.resource.kvStores.find((val) => val.ldType === UserDefDict.outputKVMapType);
		if (!ldOKV) return;
		if (ldOKV.value.hasOwnProperty(kvStore.key)) {
			const okvArr: OutputKVMapElement[] = ldOKV.value[kvStore.key];
			okvArr.forEach((okvElem) => {
				const newOutputElem = { ...okvElem };
				const srcObjRef = kvAsObjPropRef.propRef;
				if (!okvmMap.has(refString)) {
					okvmMap.set(refString, {});
				}
				let outputElem = okvmMap.get(refString)[srcObjRef];
				if (outputElem) {
					outputElem.push(newOutputElem);
				} else {
					okvmMap.get(refString)[srcObjRef] = [newOutputElem];
				}
			});
		}
	});
	okvmMap.forEach((val, key) => {
		modifiedObj[key].resource.kvStores.push({ key: UserDefDict.outputKVMapKey, value: val, ldType: UserDefDict.outputKVMapType });
	});
	return modifiedObj;
};
/*
const assignExternalOutputKvMap: RefMapIteratorFn<ILDOptionsMapStatePart> = (
	modifiedObj: ILDOptionsMapStatePart,
	rmBPCfg: BlueprintConfig,
	ldOptions: ILDOptions
) => {
	let nonRmKv: KVL[] = rmBPCfg.ownKVLs.filter((a) => a.ldType !== UserDefDict.intrprtrBPCfgRefMapType);
	let ldTkStr = ldOptions.ldToken.get();
	const okvmMap: Map<string, OutputKVMap> = new Map();
	for (const rmSubCfgKey in rmKv.value) {
		if (rmKv.value.hasOwnProperty(rmSubCfgKey)) {
			const concatNWTk = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey);
			const concatNWTkStr = concatNWTk.get();
			const rmSubCfg: BlueprintConfig = rmKv.value[rmSubCfgKey];
			let targetLDToken: ILDToken = new NetworkPreferredToken(concatNWTkStr);
			let outputKVs: OutputKVMap = {};
			rmSubCfg.ownKVLs.forEach((kv) => {
				const iKey = rmSubCfg.inKeys.find((a) => a === kv.key);
				const iKeyStr: string = iKey as string;
				if (!iKeyStr) return;
				if (!isObjPropertyRef(kv.value)) return;
				const srcObjPropRef: ObjectPropertyRef = kv.value as ObjectPropertyRef;
				const srcObjRef: string = srcObjPropRef.objRef;
				if (!okvmMap.has(srcObjRef)) {
					okvmMap.set(srcObjRef, {});
				}
				let outputElem = okvmMap.get(srcObjRef)[srcObjPropRef.propRef];
				const newOutputElem = { targetLDToken: targetLDToken, targetProperty: iKeyStr };
				if (outputElem) {
					outputElem.push(newOutputElem);
				} else {
					okvmMap.get(srcObjRef)[srcObjPropRef.propRef] = [newOutputElem];
				}
			});
		}
	}
	okvmMap.forEach((val, key) => {
		modifiedObj[key].resource.kvStores.push({ key: UserDefDict.outputKVMapKey, value: val, ldType: UserDefDict.outputKVMapType });
	});
	return modifiedObj;
};*/

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
	let refMapKV: KVL = rmBPCfg.ownKVLs && rmBPCfg.ownKVLs.length > 0
		? rmBPCfg.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType)
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

export const refMapEpic = (action$: ActionsObservable<any>, store: Store<ExplorerState>) => {
	return action$.pipe(
		ofType(REFMAP_REQUEST),
		mergeMap((action: RefMapRequestAction) => {
			let ldOptionsObj: ILDOptions = action.ldOptionsBase;
			let rv = createItpts(ldOptionsObj, store);
			return concat$(
				rv,
				of(refMapSUCCESSAction({ ...ldOptionsObj, isLoading: false }))
			);
		})
	);
};

interface InstancePrepItm {
	outputKVs: OutputKVMap;
	concatNWTk: ILDToken;
	concatNWTkStr: string;
	originalBPCfgCopy: BlueprintConfig;
	subCfg: BlueprintConfig;
	itpt: any;
}

const createItpts: (
	ldOptions: ILDOptions,
	store: Store<ExplorerState>
) => ActionsObservable<RefMapAction> = (
	ldOptions: ILDOptions,
	store: Store<ExplorerState>
) => {
		let { retriever } = ldOptions.visualInfo;
		let itptRetriever: ReduxItptRetriever = appItptMatcherFn().getItptRetriever(retriever) as ReduxItptRetriever;
		let ldTkStr = ldOptions.ldToken.get();
		let rmKv = ldOptions.resource.kvStores.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
		let rmKvVal = rmKv.value;
		let instancePrep: Map<string, InstancePrepItm> = new Map();
		for (const rmSubCfgKey in rmKvVal) {
			if (rmKvVal.hasOwnProperty(rmSubCfgKey)) {
				const concatNWTk = createConcatNetworkPreferredToken(ldTkStr, rmSubCfgKey);
				const concatNWTkStr = concatNWTk.get();
				let newOutputKvMap: OutputKVMap = {};
				let newInstancePrepItm: InstancePrepItm = {
					concatNWTk: concatNWTk,
					concatNWTkStr: concatNWTkStr,
					outputKVs: newOutputKvMap,
					originalBPCfgCopy: null,
					subCfg: rmKvVal[rmSubCfgKey],
					itpt: null
				};
				instancePrep.set(concatNWTkStr, newInstancePrepItm);
			}
		}
		//prepare data
		instancePrep.forEach((element, prepSubCfgKey) => {
			let { subCfg } = element;
			const subCfgsubItptOf: string = subCfg.subItptOf;
			let itpt: any = null;
			itpt = itptRetriever.getUnconnectedByNameSelf(subCfgsubItptOf);
			if (!itpt) throw new Error("couldn't find block: " + subCfgsubItptOf);
			let originalBPCfgCopy: BlueprintConfig = ldBlueprintCfgDeepCopy(itpt.cfg);

			//let nonRMKvStores = ldOptions.resource.kvStores.filter(
			//	(itm, idx) => itm.key !== UserDefDict.intrprtrBPCfgRefMapKey);
			/*let targetLDToken: ILDToken = new NetworkPreferredToken(concatNWTkStr);
			let outputKVs: OutputKVMap = {};
			subCfg.ownKVLs.forEach((kv) => {
				const iKey = subCfg.inKeys.find((a) => a === kv.key);
				const iKeyStr: string = iKey as string;
				if (!iKeyStr) return;
				if (!isObjPropertyRef(kv.value)) return;
				const srcObjPropRef: ObjectPropertyRef = kv.value as ObjectPropertyRef;
				instancePrep.get(srcObjPropRef.objRef).outputKVs[srcObjPropRef.propRef] = { targetLDToken: targetLDToken, targetProperty: iKeyStr };
			});*/
			instancePrep.set(prepSubCfgKey, { ...element, subCfg, originalBPCfgCopy, itpt });
		});
		let rvActions: Array<RefMapAction> = [];
		//assign data, create instances
		instancePrep.forEach((element, prepSubCfgKey) => {
			let { itpt, subCfg, originalBPCfgCopy, concatNWTkStr, concatNWTk } = element;
			//subCfg.ownKVLs.push({ key: UserDefDict.outputKVMapKey, value: outputKVs, ldType: UserDefDict.outputKVMapType });
			//this line will do the inheritance
			itpt = ldBlueprint(subCfg)(itpt);
			if (!isReactComponent(itpt)) {
				//instantiation of non-visual blueprints here
				connectNonVisLDComp(concatNWTkStr, new itpt(concatNWTkStr));
				// TODO: determine outputKVMap here, maybe assign it to itpt-Blueprint-Class earlier, so that delta is always output
			} else {
				//instantiation done in React, Class defined here
				itptRetriever.setDerivedItpt(concatNWTkStr, itpt);
			}
			// let itptAsCfg: BlueprintConfig = itpt.cfg as BlueprintConfig;
			if (!originalBPCfgCopy.ownKVLs) return;
			let itptRM = originalBPCfgCopy.ownKVLs.find((a) => a.ldType === UserDefDict.intrprtrBPCfgRefMapType);
			if (itptRM) {
				let newSubRMInputs: KVL[] = subCfg.ownKVLs;
				let newRMLDOptions: ILDOptions = {
					lang: ldOptions.lang,
					isLoading: false,
					ldToken: concatNWTk,
					visualInfo: { retriever: ldOptions.visualInfo.retriever, interpretedBy: itpt.nameSelf },
					resource: { webInResource: null, webOutResource: null, kvStores: newSubRMInputs }
				};
				rvActions.push(refMapREQUESTAction(newRMLDOptions, originalBPCfgCopy));
			}
		});
		let rv: ActionsObservable<RefMapAction> = ActionsObservable.from(rvActions);
		return rv;
	};
