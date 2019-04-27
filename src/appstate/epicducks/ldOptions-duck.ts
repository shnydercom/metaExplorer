import { ActionsObservable, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
//import "rxjs/Rx";
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { LDError, LDErrorMsgState } from './../LDError';
import { ILDOptionsMapStatePart } from 'appstate/store';
import { IKvStore } from 'ldaccess/ikvstore';
import { ILDOptions } from 'ldaccess/ildoptions';
import { ILDToken, NetworkPreferredToken } from 'ldaccess/ildtoken';
import { ldOptionsDeepCopy } from 'ldaccess/ldUtils';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultItptRetriever';
import { OutputKVMap } from 'ldaccess/ldBlueprint';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';
import { LDOptionsAPI } from 'apis/ldoptions-api';

export const LDOPTIONS_CLIENTSIDE_CREATE = 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE';
export const LDOPTIONS_CLIENTSIDE_UPDATE = 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE';
export const LDOPTIONS_REQUEST_ASYNC = 'shnyder/LDOPTIONS_REQUEST_ASYNC';
export const LDOPTIONS_REQUEST_ERROR = 'shnyder/LDOPTIONS_REQUEST_ERROR';
export const LDOPTIONS_REQUEST_RESULT = 'shnyder/LDOPTIONS_REQUEST_RESULT';
export const LDOPTIONS_KV_UPDATE = 'shnyder/LDOPTIONS_KV_UPDATE';
export const ACTION_LDACTION = 'shnyder/ACTION_LDACTION';

export type LD_KVUpdateAction = { type: 'shnyder/LDOPTIONS_KV_UPDATE', changedKvStores: IKvStore[], thisLdTkStr: string, updatedKvMap: OutputKVMap };

export type LDActionType = { type: 'shnyder/ACTION_LDACTION', ldId: string, ldType: string, payload: any };

export type LDAction =
	{ type: 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE', kvStores: IKvStore[], lang: string, alias: string }
	| { type: 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE', updatedLDOptions: ILDOptions }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ASYNC', isExternalAPICall: boolean, uploadData: ILDOptions, targetUrl: string, targetReceiverLnk: string }
	| { type: 'shnyder/LDOPTIONS_REQUEST_RESULT', ldOptionsPayload: IWebResource, targetReceiverLnk: string }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ERROR', message: string, targetReceiverLnk: string }
	| LD_KVUpdateAction
	| LDActionType;

const externalAPICallDict = new Map<string, () => Promise<any>>();

//Action factories, return action objects
export const ldOptionsClientSideCreateAction = (kvStores: IKvStore[], lang: string, alias: string) => ({
	type: LDOPTIONS_CLIENTSIDE_CREATE,
	kvStores: kvStores,
	lang: lang,
	alias: alias
});

export const ldOptionsClientSideUpdateAction = (updatedLDOptions: ILDOptions) => ({
	type: LDOPTIONS_CLIENTSIDE_UPDATE,
	updatedLDOptions: updatedLDOptions
});

/**
 * used to wrap any calls to APIs so that they can be easily consumed by the state
 * @param apiCallOverride !!! if set, uploadData and targetUrl will be ignored.
 * @param uploadData default call: upload data for jsonld-POST request
 * @param targetUrl default call: REST endpoint (jsonld)
 * @param targetReceiverLnk the receiving interpreter's link
 */
export const ldOptionsRequestAction = (apiCallOverride: () => Promise<any>, uploadData?: ILDOptions, targetUrl?: string, targetReceiverLnk?) => {
	if (apiCallOverride) {
		externalAPICallDict.set(targetReceiverLnk, apiCallOverride);
		return {
			isExternalAPICall: true,
			type: LDOPTIONS_REQUEST_ASYNC,
			uploadData: uploadData,
			targetUrl: targetUrl,
			targetReceiverLnk
		};
	} else {
		return {
			isExternalAPICall: false,
			type: LDOPTIONS_REQUEST_ASYNC,
			uploadData: uploadData,
			targetUrl: targetUrl,
			targetReceiverLnk
		};
	}
};

export const ldOptionsResultAction = (ldOptionsPayload: IWebResource, targetReceiverLnk) => {
	externalAPICallDict.delete(targetReceiverLnk);
	return {
		type: LDOPTIONS_REQUEST_RESULT,
		ldOptionsPayload,
		targetReceiverLnk
	};
};

export const ldOptionsFailureAction = (message: string, targetReceiverLnk): LDErrorMsgState => {
	externalAPICallDict.delete(targetReceiverLnk);
	return {
		type: LDOPTIONS_REQUEST_ERROR,
		message,
		targetReceiverLnk
	};
};

export const dispatchKvUpdateAction = (changedKvStores: IKvStore[], thisLdTkStr: string, updatedKvMap: OutputKVMap) => ({
	type: LDOPTIONS_KV_UPDATE,
	changedKvStores,
	thisLdTkStr,
	updatedKvMap
});

/**
 * dispatches an LDAction that can be handled globally by a type- or id- action-handler. Used for handling button-pressing etc.
 * @param ldId one of id or ldType has to be defined
 * @param ldType one of id or ldType has to be defined
 * @param payload the payload for the actionhandler
 */
export const ldAction = (ldId: string, ldType: string, payload): LDActionType => ({ type: ACTION_LDACTION, ldId, ldType, payload });

//this will modify the hashmap containing all the ILDOptions
export const ldOptionsMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: LDAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case ACTION_LDACTION:
			break;
		case LDOPTIONS_CLIENTSIDE_CREATE:
			let isUpdateNeeded: boolean = false;
			let actionAlias: string = action.alias;
			if (!state[actionAlias]) {
				isUpdateNeeded = true;
			} else {
				//check for changes
				let singleLDOptions: ILDOptions = state[actionAlias];
				if ((singleLDOptions.lang !== action.lang)
					|| (singleLDOptions.ldToken.get() !== action.alias)
				) {
					isUpdateNeeded = true;
				}
				//check KvStores
				if (!action.kvStores && !singleLDOptions.resource.kvStores) break;
				if (!isUpdateNeeded &&
					(
						(!action.kvStores && singleLDOptions.resource.kvStores)
						|| (action.kvStores && !singleLDOptions.resource.kvStores)
						|| (action.kvStores.length !== singleLDOptions.resource.kvStores.length)
					)
				) {
					isUpdateNeeded = true;
				} else {
					//check kvStores in detail, quick and dirty deep compare
					let kvStoresA: IKvStore[] = action.kvStores;
					let kvStoresB: IKvStore[] = singleLDOptions.resource.kvStores;
					isUpdateNeeded = !(JSON.stringify(kvStoresA) === JSON.stringify(kvStoresB));
				}
			}
			if (isUpdateNeeded) {
				let ldToken: ILDToken = new NetworkPreferredToken(action.alias);
				let newLDCfg: ILDOptions = {
					lang: action.lang,
					isLoading: false,
					ldToken: ldToken,
					visualInfo: {
						retriever: DEFAULT_ITPT_RETRIEVER_NAME
					},
					resource: {
						kvStores: action.kvStores,
						webInResource: null,
						webOutResource: null
					}
				};
				actionAlias = ldToken.get();
				let newState = Object.assign({}, state, { [actionAlias]: newLDCfg });
				return newState;
			}
			break;
		case LDOPTIONS_CLIENTSIDE_UPDATE:
			let tokenVal = (action.updatedLDOptions.ldToken as NetworkPreferredToken).get();
			let updatedLDOptionsObj = { ...action.updatedLDOptions };
			let updatedState = Object.assign({}, state, { [tokenVal]: updatedLDOptionsObj });
			return updatedState;
		case LDOPTIONS_REQUEST_ASYNC:
			console.log("async ldoptions request");
			console.dir(action);
			let asyncLnk = action.targetReceiverLnk;
			let asyncReqLDOptions = ldOptionsDeepCopy(state[asyncLnk]);
			asyncReqLDOptions.isLoading = true;
			let asyncedState = Object.assign({}, state, { [asyncLnk]: asyncReqLDOptions });
			return asyncedState;
		case LDOPTIONS_REQUEST_RESULT:
			let lnk = action.targetReceiverLnk;
			let payload = action.ldOptionsPayload;
			let newLDOptions = ldOptionsDeepCopy(state[lnk]);
			newLDOptions.isLoading = false;
			newLDOptions.resource.webInResource = payload;
			let reqResultState = Object.assign({}, state, { [lnk]: newLDOptions });
			return reqResultState;
		case LDOPTIONS_REQUEST_ERROR:
			console.log('ldOptions Error message received, subMsg: ' + action.message);
			return state;
		case LDOPTIONS_KV_UPDATE:
			let stateCopy = { ...state };
			let { changedKvStores, updatedKvMap, thisLdTkStr } = action;
			stateCopy[thisLdTkStr] = ldOptionsDeepCopy(stateCopy[thisLdTkStr]);
			changedKvStores.forEach((kvElem) => {
				let elemKey = kvElem.key;
				let modKVMapPart = updatedKvMap[elemKey];
				if (!modKVMapPart || elemKey === null) return;
				//modify on "this" first:
				let thisTokenStrKVIdx = stateCopy[thisLdTkStr].resource.kvStores.findIndex((a) => a.key === elemKey);
				const srcKvCopy = stateCopy[thisLdTkStr].resource.kvStores.slice();
				if (thisTokenStrKVIdx === -1) {
					srcKvCopy.push(kvElem);
				} else {
					srcKvCopy[thisTokenStrKVIdx] = kvElem;
				}
				stateCopy[thisLdTkStr].resource.kvStores = srcKvCopy;
				//then modify on target, copying to target property key:
				for (let idx = 0; idx < modKVMapPart.length; idx++) {
					const outputElem = modKVMapPart[idx];
					let targetTokenStr = outputElem.targetLDToken.get();
					let targetProp = outputElem.targetProperty;
					stateCopy[targetTokenStr] = ldOptionsDeepCopy(stateCopy[targetTokenStr]);
					const targetKvCopy = stateCopy[targetTokenStr].resource.kvStores.slice();
					let targetTokenStrKvIdx = targetKvCopy.findIndex((a) => a.key === targetProp);
					let kvElemCopy: IKvStore = {
						key: targetProp,
						value: kvElem.value,
						ldType: kvElem.ldType
					};
					targetKvCopy[targetTokenStrKvIdx] = kvElemCopy;
					stateCopy[targetTokenStr].resource.kvStores = targetKvCopy;
				}
			});
			return stateCopy;
		default:
			return state;
	}
	return state;
};

export const requestLDOptionsEpic = (action$: ActionsObservable<any>, store: any, { ldOptionsAPI }: any) => {
	const _LDOAPI: LDOptionsAPI = ldOptionsAPI;
	return action$.pipe(
		ofType(LDOPTIONS_REQUEST_ASYNC),
		tap(() => console.log("Requesting LD Options from network")),
		mergeMap((action) => {
			console.log(action.targetReceiverLnk);
			if (action.isExternalAPICall) {
				let apiCallOverride: () => Promise<any> = externalAPICallDict.get(action.targetReceiverLnk);
				let apiObservable = from(apiCallOverride());
				return apiObservable.pipe(map((val: any) => {
					/*let response: IWebResource = {
						hypermedia: val,
						iri: null,
						type: null
					};*/
					return ldOptionsResultAction(val, action.targetReceiverLnk);
				}),
					catchError((error) =>
						of(ldOptionsFailureAction(
							`An error occured during ld getting: ${error}`, action.targetReceiverLnk
						))));
			} else {
				if (action.uploadData === null) {
					let rvGET = _LDOAPI.getLDOptions(action.targetUrl);
					return rvGET.pipe(
						map((response: IWebResource) => ldOptionsResultAction(response, action.targetReceiverLnk))
						,
						catchError((error: LDError) =>
							of(ldOptionsFailureAction(
								`An error occured during ld getting: ${error.message + " " + error.stack}`, action.targetReceiverLnk
							))));
				} else {
					let rvPOST = _LDOAPI.postLDOptions(action.uploadData, action.targetUrl);
					return rvPOST.pipe(
						map((response: IWebResource) => ldOptionsResultAction(response, action.targetReceiverLnk))
						,
						catchError((error: LDError) =>
							of(ldOptionsFailureAction(
								`An error occured during ld posting: ${error.message + " " + error.stack}`, action.targetReceiverLnk
							))));
				}
			}
		})
	);
};
