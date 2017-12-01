import { Action, Store } from 'redux';
import { ActionsObservable, Epic, Options } from 'redux-observable';
import { AjaxError, Observable } from 'rxjs/Rx';
import "rxjs/Rx";
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { LDError, LDErrorMsgState } from './../LDError';
import { ILDOptionsMapStatePart } from 'appstate/store';
import { IKvStore } from 'ldaccess/ikvstore';
import { ILDOptions } from 'ldaccess/ildoptions';
import { ILDToken, NetworkPreferredToken } from 'ldaccess/ildtoken';

export const LDOPTIONS_CLIENTSIDE_CREATE = 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE';
export const LDOPTIONS_CLIENTSIDE_UPDATE = 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE';
export const LDOPTIONS_REQUEST_ASYNC = 'shnyder/LDOPTIONS_REQUEST_ASYNC';
export const LDOPTIONS_REQUEST_ERROR = 'shnyder/LDOPTIONS_REQUEST_ERROR';
export const LDOPTIONS_REQUEST_RESULT = 'shnyder/LDOPTIONS_REQUEST_RESULT';

export type LDAction =
	{ type: 'shnyder/LDOPTIONS_CLIENTSIDE_CREATE', kvStores: IKvStore[], lang: string, alias: string }
	| { type: 'shnyder/LDOPTIONS_CLIENTSIDE_UPDATE', updatedLDOptions: ILDOptions }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ASYNC', uploadData: ILDOptions, targetUrl: string }
	| { type: 'shnyder/LDOPTIONS_REQUEST_RESULT', ldOptionsPayload: IWebResource }
	| { type: 'shnyder/LDOPTIONS_REQUEST_ERROR', message: string };

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

export const ldOptionsRequestAction = (uploadData: ILDOptions, targetUrl: string) => ({
	type: LDOPTIONS_REQUEST_ASYNC,
	uploadData: uploadData,
	targetUrl: targetUrl
});

export const ldOptionsResultAction = (ldOptionsPayload: IWebResource) => ({
	type: LDOPTIONS_REQUEST_RESULT,
	ldOptionsPayload
});

export const ldOptionsFailureAction = (message: string): LDErrorMsgState => ({
	type: LDOPTIONS_REQUEST_ERROR,
	message
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
				}else{
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
			return {...state};
		case LDOPTIONS_REQUEST_ASYNC:
			return state;
		case LDOPTIONS_REQUEST_RESULT:
			return state;
		case LDOPTIONS_REQUEST_ERROR:
			return state;
		default:
			return state;
	}
	return state;
};

export const requestLDOptionsEpic = (action$: ActionsObservable<any>, store: any, { ldOptionsAPI }: any) => {
	return action$.ofType(LDOPTIONS_REQUEST_ASYNC)
		.do(() => console.log("Requesting LD Options from network"))
		.mergeMap((action) =>
			ldOptionsAPI.postNewImage(action.uploadData, action.targetUrl)
				.map((response: IWebResource) => ldOptionsResultAction(response))
				.catch((error: LDError): ActionsObservable<LDErrorMsgState> =>
					ActionsObservable.of(ldOptionsFailureAction(
						'An error occured during image uploading: ${error.message}'
					)))
		);
};
