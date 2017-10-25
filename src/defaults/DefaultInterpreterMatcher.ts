import { LDConsts } from "ldaccess/LDConsts";

import { IInterpreterMatcher } from "ldaccess/iinterpreter-matcher";
import { IKvStore } from "ldaccess/ikvstore";

import appIntRetrFn from 'appconfig/appInterpreterRetriever';
import { LDDict } from "ldaccess/LDDict";

//import ImageUploadComponent from 'components/imageupload-component';
import ImageDisplayComponent from 'components/imagedisplay-component';
import { BooleanValInput, IntegerValInput, DoubleValInput, TextValInput, DateValInput, DateTimeValInput } from "components/basedatatypeinterpreter/BaseDataTypeInput";

let matchIsType = (a: IKvStore) => a.key === LDConsts.type || a.key === LDConsts.isA;
let matchIsLang = (a: IKvStore) => a.key === LDConsts.lang;
let matchIsId = (a: IKvStore) => a.key === LDConsts.id || a.key === LDConsts.iri;

/**
 * the matcher is used for encapsuling the decision process that associates keys and values in a kv-store a matching interpreter.
 * Currently, this is also the place where additional Interpreters are registered to the AppInterpreterRetriever, because it's not
 * possible there
 */
export class DefaultInterpreterMatcher implements IInterpreterMatcher {
	constructor() {
		let appIntRetr = appIntRetrFn();
		//appIntRetr.addInterpreter(LDDict.CreateAction, ImageUploadComponent, "Crud");
		appIntRetr.addInterpreter(LDDict.ImageObject, ImageDisplayComponent, "cRud");

		//register base data type inputs:
		appIntRetr.addInterpreter(LDDict.Boolean, BooleanValInput, "crud");
		appIntRetr.addInterpreter(LDDict.Integer, IntegerValInput, "CRUd");
		appIntRetr.addInterpreter(LDDict.Double, DoubleValInput, "CRUd");
		appIntRetr.addInterpreter(LDDict.Text, TextValInput, "CRUd");
		appIntRetr.addInterpreter(LDDict.Date, DateValInput, "CRUd");
		appIntRetr.addInterpreter(LDDict.DateTime, DateTimeValInput, "CRUd");
	}
	matchSingleKV(single: IKvStore, crudSkills: string): IKvStore {
		throw new Error("Method not implemented.");
	}
	matchKvArray(multi: IKvStore[], crudSkills: string): IKvStore[] {
		let rv: IKvStore[] = [];
		let ldType = multi.find(matchIsType);
		let ldLang = multi.find(matchIsLang);
		let ldId = multi.find(matchIsId);
		if (ldId !== null) {
			//this is a base object and has an id, if an interpreter-retriever for special IDs is defined, then it could be used here
			//return;
		}
		if (ldType !== null) {
			//this is a typed base object then
			let searchTerm: string | Array<string> = ldType.value;
			if (searchTerm) {
				if (typeof searchTerm === "string") {
					let intrprtr = appIntRetrFn().searchForObjIntrprtr(searchTerm, crudSkills);
					let rvAdd: IKvStore = { key: null, value: null, intrprtrClass: intrprtr, ldType: searchTerm };
					rv.push(rvAdd);
					return rv;
				}
			}
		}
	}

}
