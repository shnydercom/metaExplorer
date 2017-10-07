// /// <reference path="../node_modules/@types/jasmine/index.d.ts" />
// let Jasmine = require('jasmine');

//import {describe, it, expect} from 'jasmine';
import jasmine from 'jasmine';

import { ActionsObservable } from "redux-observable";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';

import * as imguploadEpic from "appstate/epicducks/image-upload";
import { processAsWebResource } from '../testing/mockHydra';

var successResult = {
	"@context": {
		"@vocab": "http://schema.org/",
		"rdfs": "http://www.w3.org/2000/01/rdf-schema#"
	},
	"@id": "http://shnyder.com/ade43b9f-e7b0-474d-84c9-37b4f70ea3df",
	"@language": "en",
	"@type": "http://schema.org/ImageObject",
	"http://schema.org/name": [
		"1407306_orig.jpg"
	],
	"http://schema.org/fileFormat": [
		"image/jpeg"
	],
	"http://schema.org/contentUrl": [
		"ade43b9f-e7b0-474d-84c9-37b4f70ea3df"
	]
};

var resultPromise: Promise<IWebResource> = null;
/*
var imgUploadData = POST /rest/ysj/media/upload HTTP/1.1
Host: localhost:1111
Cache-Control: no-cache
Postman-Token: 05362090-7232-e0f7-dafb-12e89c4cb5f8
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="1407306_orig.jpg"
Content-Type: image/jpeg

------WebKitFormBoundary7MA4YWxkTrZu0gW--*/

beforeAll(() => {
	//resultPromise = processAsWebResource(successResult);
});

describe("imageUploadEpic", () => {
	it("is left out for tests because of JS file API resctrictions", (done) => {
		//FileList in HTML5 is readonly from Forms
		//var fileList: FileList = new FileList();
		//var file: File = new File([""], "testing/Testimage.png");
		//fileList.item[0] = file;
	/*const dependencies = {
			imgULAPI: (url) => Observable.of(successResult)
		};
		var resultPromise: Promise<IWebResource> = processAsWebResource(successResult);

		resultPromise.then( (resultWR: IWebResource) => {
			console.log("inner")
			console.dir(resultWR);
			const action$ = ActionsObservable.of(imguploadEpic.uploadImgRequestAction(null));
			const expectedOutputActions = imguploadEpic.uploadImgResultAction(resultWR);
			const result = imguploadEpic.uploadImageEpic(action$, null, dependencies).subscribe((actionReceived) => {
				expect((actionReceived as any).type).toBe(expectedOutputActions.type);
				done();
			});
		}
		);*/
		done();
	});
});
