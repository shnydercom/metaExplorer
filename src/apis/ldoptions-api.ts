import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import TypesCollection from 'hydraclient.js/src/DataModel/Collections/TypesCollection';
import { HydraClientAPI } from './hydra-client';
import { LDError } from './../appstate/LDError';
import { Observable } from 'rxjs/Observable';
import { ILDOptions } from 'ldaccess/ildoptions';

//let testTC = new TypesCollection(["someTypeInAnArray"] || new Array<string>());
//console.log(testTC.contains("someTypeInAnArray"));

/*
class MyArray<T> extends Array<T> {
	constructor(items?: Array<T>) {
		super(...items);
		Object.setPrototypeOf(this, Object.create(MyArray.prototype));
	}
	logCount() {
		console.log("Count: " + this.length)
	}
}

var myArray = new MyArray<string>();
console.dir(myArray);
myArray.logCount();
*/

export class LDOptionsAPI {  // URL to web api IRI resource
	getLDOptions(targetUrl: string): Observable<IWebResource> {
		if (targetUrl == null) {
			throw new Error(("no targetUrl defined for LDOptionsAPI"));
		}
		let returnVal: Observable<IWebResource>;
		let uploadDataSerialized: string;
		let fetchPromise = fetch(targetUrl, {
			method: 'GET',
			headers: {
				Accept: "application/ld+json"
			},
			/*
			mode: 'cors',
			cache: 'default'*/
		})
			.then((response) => {
				if (response.status >= 400) {
					throw new LDError("Bad response from server");
				}
				var testVar = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response);
				var procResource = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response).process(response, HydraClientAPI.getHCSingleton()).then((hydraResponse) => {
					console.dir(hydraResponse);
					return hydraResponse;
				});
				return procResource;
			});
		returnVal = Observable.from(fetchPromise);
		return returnVal;
	}
	postLDOptions(uploadData: ILDOptions, targetUrl: string): Observable<IWebResource> {//Observable<IWebResource> { //FETCH
		if (targetUrl == null) {
			throw new Error(("no targetUrl defined for LDOptionsAPI"));
		}
		let returnVal: Observable<IWebResource>;
		let uploadDataSerialized: string;
		let fetchPromise = fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/ld+json',
				'Content-Type': "application/ld+json"
			},
			body: uploadDataSerialized
		})
			.then((response) => {
				if (response.status >= 400) {
					throw new LDError("Bad response from server");
				}
				var testVar = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response);
				var procResource = HydraClientAPI.getHCSingleton().getHypermediaProcessor(response).process(response, HydraClientAPI.getHCSingleton()).then((hydraResponse) => {
					console.dir(hydraResponse);
					return hydraResponse;
				});
				return procResource;
			});
		returnVal = Observable.from(fetchPromise);
		return returnVal;
	}
}
