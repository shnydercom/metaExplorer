import { Action } from 'redux';
import { MOD_LOAD_REQUEST, MOD_LOAD_RESULT_ALL } from './mod-duck';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { tap, mapTo } from 'rxjs/operators';
import { changeMainAppItpt } from '../../appconfig/retrieverAccessFns';
import { ExplorerState } from '../store';
export const IS_LOADING_TRUE = 'metaexplorer.io/IS_LOADING_TRUE';
export const IS_LOADING_FALSE = 'metaexplorer.io/IS_LOADING_FALSE';

//Action factories
export const startLoadingAction = () => ({
	type: IS_LOADING_TRUE,
});

export const stopLoadingAction = () => ({
	type: IS_LOADING_FALSE
});

//for the loading-indicating part of the state
export const isLoadingReducer = (
	state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case MOD_LOAD_REQUEST:
			return true;
		case MOD_LOAD_RESULT_ALL:
			return true;
		case IS_LOADING_FALSE:
			return false;
		default:
			return state;
	}
};

export const loadingEpic = (action$: ActionsObservable<any>, store: StateObservable<ExplorerState>) => {
	return action$.pipe(
		ofType(MOD_LOAD_RESULT_ALL),
		tap(() => {
			const storeval = store.value;
			if (store.value.ldoptionsMap[storeval.appCfg.appKey]) {
				changeMainAppItpt(storeval.appCfg.mainItpt, store.value.ldoptionsMap[storeval.appCfg.appKey].resource.kvStores);
			} else {
				changeMainAppItpt(storeval.appCfg.mainItpt);
			}
		}), // debugging
		mapTo(stopLoadingAction())
	);
};
