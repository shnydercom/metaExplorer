import { ActionsObservable } from "redux-observable";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";

import * as example from "./exampleEpic";

const successResult: example.IUserResult = {
    id: "123",
    name: "Test User"
};

describe("loadUserEpic", () => {

    // done: see https://facebook.github.io/jest/docs/asynchronous.html

    it("dispatches a result action when the user is loaded", (done) => {

        const dependencies = {
            getJSON: url => Observable.of(successResult)
        };

        const action$ = ActionsObservable.of(example.loadUser(successResult.id));
        const expectedOutputActions = example.loadUserResult(successResult);

        const result = example.loadUserEpic(action$, null, dependencies).subscribe(actionReceived => {
            expect((actionReceived as any).type).toBe(expectedOutputActions.type);
            done();
        });

    });

    it("dispatches an error action when ajax fails", (done) => {
        
        const errorMessage = "Failed Ajax Call";
        
        const dependencies = {
            getJSON: url => Observable.throw(new Error(errorMessage))
        };

        const action$ = ActionsObservable.of(example.loadUser(successResult.id));
        const expectedOutputActions = example.loadFailure(`An error occurred: ${errorMessage}`);

        const result = example.loadUserEpic(action$, null, dependencies).subscribe(actionReceived => {
            expect((actionReceived as any).type).toBe(expectedOutputActions.type);
            expect((actionReceived as any).message).toBe(
                expectedOutputActions.message);
            done();
        });

    });

});