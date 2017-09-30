/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
let Jasmine = require('jasmine');

import { ActionsObservable } from "redux-observable";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";

import * as imguploadEpic from "appstate/epicducks/image-upload";

describe("loadUserEpic", () => {
    it("dispatches a result action when the user is loaded", () => {

        expect(true).toBe(true);
    });
});