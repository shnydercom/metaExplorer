import { Action, Store } from 'redux';
import { ActionsObservable, Epic, Options } from 'redux-observable';
import { AjaxError, Observable } from 'rxjs/Rx';
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

export const LDOPTIONS_CLIENTSIDE_CREATE = 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE';
export const LDOPTIONS_CLIENTSIDE_UPDATE = 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE';
export const LDOPTIONS_REQUEST_ASYNC = 'shnyder/LDOPTIONS_REQUEST_ASYNC';
export const LDOPTIONS_REQUEST_ERROR = 'shnyder/LDOPTIONS_REQUEST_ERROR';
export const LDOPTIONS_REQUEST_RESULT = 'shnyder/LDOPTIONS_REQUEST_RESULT';
export const LDOPTIONS_KV_UPDATE = 'shnyder/LDOPTIONS_KV_UPDATE';

export type LDAction =
	{ type: 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE', kvStores: IKvStore[], lang: string, alias: string }
	| { type: 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE', updatedLDOptions: ILDOptions }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ASYNC', uploadData: ILDOptions, targetUrl: string, targetReceiverLnk: string }
	| { type: 'shnyder/LDOPTIONS_REQUEST_RESULT', ldOptionsPayload: IWebResource, targetReceiverLnk: string }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ERROR', message: string, targetReceiverLnk: string }
	| { type: 'shnyder/LDOPTIONS_KV_UPDATE', changedKvStores: IKvStore[], thisLdTkStr: string, updatedKvMap: OutputKVMap };

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

export const ldOptionsRequestAction = (uploadData: ILDOptions, targetUrl: string, targetReceiverLnk) => ({
	type: LDOPTIONS_REQUEST_ASYNC,
	uploadData: uploadData,
	targetUrl: targetUrl,
	targetReceiverLnk
});

export const ldOptionsResultAction = (ldOptionsPayload: IWebResource, targetReceiverLnk) => ({
	type: LDOPTIONS_REQUEST_RESULT,
	ldOptionsPayload,
	targetReceiverLnk
});

export const ldOptionsFailureAction = (message: string, targetReceiverLnk): LDErrorMsgState => ({
	type: LDOPTIONS_REQUEST_ERROR,
	message,
	targetReceiverLnk
});

export const dispatchKvUpdateAction = (changedKvStores: IKvStore[], thisLdTkStr: string, updatedKvMap: OutputKVMap) => ({
	type: LDOPTIONS_KV_UPDATE,
	changedKvStores,
	thisLdTkStr,
	updatedKvMap
});

//this will modify the hashmap containing all the ILDOptions
export const ldOptionsMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: LDAction): ILDOptionsMapStatePart => {
	switch (action.type) {
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
	return action$.ofType(LDOPTIONS_REQUEST_ASYNC)
		.do(() => console.log("Requesting LD Options from network"))
		.mergeMap((action) => {
			console.log(action.targetReceiverLnk);
			if (action.uploadData === null) {
				return ldOptionsAPI.getLDOptions(action.targetUrl)
					.map((response: IWebResource) => ldOptionsResultAction(response, action.targetReceiverLnk))
					.catch((error: LDError): ActionsObservable<LDErrorMsgState> =>
						ActionsObservable.of(ldOptionsFailureAction(
							`An error occured during ld getting: ${error.message + " " + error.stack}`, action.targetReceiverLnk
						)));
			} else {
				return ldOptionsAPI.postLDOptions(action.uploadData, action.targetUrl)
					.map((response: IWebResource) => ldOptionsResultAction(response, action.targetReceiverLnk))
					.catch((error: LDError): ActionsObservable<LDErrorMsgState> =>
						ActionsObservable.of(ldOptionsFailureAction(
							`An error occured during ld posting: ${error.message + " " + error.stack}`, action.targetReceiverLnk
						)));
			}
		});
};
