import { ActionsObservable, ofType } from "redux-observable";
import { tap, mergeMap, map, catchError } from 'rxjs/operators';
import { IModStatePart, SingleModStateKeysDict, IModStatus } from '../../appstate/modstate';
import { of, from } from 'rxjs';
import { ModAPI } from '../../apis/mod-api';

export const MOD_LOAD_REQUEST = "Mod/MOD_LOAD_REQUEST";
export const MOD_LOAD_RESULT = "Mod/MOD_LOAD_RESULT";
export const MOD_LOAD_RESULT_ALL = "Mod/MOD_LOAD_RESULT_ALL";
export const MOD_LOAD_ERROR = "Mod/MOD_LOAD_ERROR";

export type ModErrorAction = { type: 'Mod/MOD_LOAD_ERROR', modId: string, message: string };
export type ModAction =
	{ type: 'Mod/MOD_LOAD_REQUEST', modId: string }
	| { type: 'Mod/MOD_LOAD_RESULT', statusResult: IModStatus }
	| { type: 'Mod/MOD_LOAD_RESULT_ALL', statusResult: IModStatus }
	| ModErrorAction;

export interface IModAjaxError {
	type: string;
	modId: string;
	message: string;
}

export const loadMod = (modId: string) => ({
	type: MOD_LOAD_REQUEST,
	modId
});

export const loadModResult = (statusResult: IModStatus) => ({
	type: MOD_LOAD_RESULT,
	statusResult
});

export const loadModResultAll = (statusResult: IModStatus) => ({
	type: MOD_LOAD_RESULT_ALL,
	statusResult
});

export const loadModFailure = (modId: string, message: string): IModAjaxError => ({
	type: MOD_LOAD_ERROR,
	modId,
	message
});

export const modStatePartReducer = (
	state: IModStatePart, action: ModAction): IModStatePart => {
	let newState = Object.assign({}, state);
	console.dir(action);
	switch (action.type) {
		case MOD_LOAD_REQUEST:
			newState.map[action.modId] = { id: action.modId, name: null, state: SingleModStateKeysDict.loading };
			return newState;
		case MOD_LOAD_RESULT:
			newState.map[action.statusResult.id] = action.statusResult;
			return newState;
		case MOD_LOAD_RESULT_ALL:
			newState.map[action.statusResult.id] = action.statusResult;
			return newState;
		case MOD_LOAD_ERROR:
			newState.map[action.modId] = { id: action.modId, name: null, state: SingleModStateKeysDict.error, errorMsg: action.message };
			return newState;
		default:
			return newState;
	}
};

export const loadModEpic = (action$: ActionsObservable<any>, store: any, { modAPI }: any) => {
	const _MODAPI: ModAPI = modAPI;
	const modQueue: string[] = [];
	return action$.pipe(
		ofType(MOD_LOAD_REQUEST),
		tap(() => console.log("requesting Mod...")), // debugging
		mergeMap((action) => {
			if (!_MODAPI.checkDependencies(action.modId)) {
				modQueue.push(action.modId);
				return from([]);
			} else {
				let rv = from(_MODAPI.getModData(action.modId));
				return rv.pipe(
					map((response) => {
						_MODAPI.setModLoadingComplete(action.modId);
						for (let idx = 0; idx < modQueue.length; idx++) {
							const mod = modQueue[idx];
							if (_MODAPI.checkDependencies(mod)) {
								modQueue.splice(idx, 1);
								return loadMod(mod);
							}
						}
						if (_MODAPI.isRequiredLoadingComplete()) {
							return loadModResultAll(response as any);
						} else {
							return loadModResult(response as any);
						}
					})
					,
					catchError((error: Error) =>
						of(loadModFailure(action.modId,
							`An error occurred: ${error.message}`
						))));
			}
		}
		)
	);
};
