import {ActionsObservable} from "redux-observable";
import {AjaxError} from "rxjs/Rx";
import "rxjs/Rx";

import { DiagramEngine } from 'storm-react-diagrams'

//source: https://mikebridge.github.io/articles/typescript-redux-observable-epic-test/

export const USER_LOAD_REQUEST = "example/USER_LOAD_REQUEST";

export const USER_LOAD_RESULT = "example/USER_LOAD_RESULT";

export const USER_LOAD_ERROR = "example/USER_LOAD_ERROR";

export interface IUserResult {
    id: string;
    name: string;
}

export interface ICustomAjaxError {
    type: string;
    message: string;
}

export const loadUser = (userid: string) => ({
    type: USER_LOAD_REQUEST,
    userid
});

export const loadUserResult = (results: IUserResult) => ({
    type: USER_LOAD_RESULT,
    results
});

export const loadFailure = (message: string): ICustomAjaxError => ({
    type: USER_LOAD_ERROR,
    message
});


export const loadUserEpic = (action$: ActionsObservable<any>, store, {getJSON}) => {
    return action$.ofType(USER_LOAD_REQUEST)
        .do(() => console.log("Locating User ...")) // debugging
        .mergeMap(action =>
            getJSON(`%PUBLIC_URL%/api/users`)
                .map(response => loadUserResult(response as any))
                .catch((error: AjaxError): ActionsObservable<ICustomAjaxError> =>
                    ActionsObservable.of(loadFailure(
                        `An error occurred: ${error.message}`
                    )))
        );

};

export default loadUserEpic;