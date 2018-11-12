import { Action, Store } from 'redux';
import { ActionsObservable, Epic, Options, ofType } from "redux-observable";
import { AjaxError, Observable } from "rxjs/Rx";
import { tap, mergeMap } from 'rxjs/operators';
//import "rxjs/Rx"; //TODO: re-check this line and only import what's needed
//source: https://mikebridge.github.io/articles/typescript-redux-observable-epic-test/

export const SCHEMA_LOAD_REQUEST = "schema/SCHEMA_LOAD_REQUEST";

export const SCHEMA_LOAD_RESULT = "schema/SCHEMA_LOAD_RESULT";

export const SCHEMA_LOAD_ERROR = "schema/SCHEMA_LOAD_ERROR";

export interface ISchemaResult {
    id: string;
    name: string;
}

export interface ISchemaAjaxError {
    type: string;
    message: string;
}

export const loadSchema = (userid: string) => ({
    type: SCHEMA_LOAD_REQUEST,
    userid
});

export const loadSchemaResult = (results: ISchemaResult) => ({
    type: SCHEMA_LOAD_RESULT,
    results
});

export const loadSchemaFailure = (message: string): ISchemaAjaxError => ({
    type: SCHEMA_LOAD_ERROR,
    message
});

export const isLoadingSchemaReducer = function isLoading(state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case SCHEMA_LOAD_REQUEST:
            return true;
        case SCHEMA_LOAD_RESULT:
        case SCHEMA_LOAD_ERROR:
            return false;
        default:
            return state;
    }
};

export const loadSchemaEpic = (action$: ActionsObservable<any>, store: any, { getJSON }: any) => {
    return action$.pipe(
        ofType(SCHEMA_LOAD_REQUEST),
        tap(() => console.log("Locating User ...")), // debugging
        mergeMap((action) =>
            getJSON(`%PUBLIC_URL%/api/users`)
                .map((response: any) => loadSchemaResult(response as any))
                .catch((error: AjaxError): ActionsObservable<ISchemaAjaxError> =>
                    ActionsObservable.of(loadSchemaFailure(
                        `An error occurred: ${error.message}`
                    )))
        )
    );
};

export default loadSchemaEpic;
