import { LDConsts } from "ldaccess/LDConsts";

import { IInterpreterMatcher } from "ldaccess/iinterpreter-matcher";
import { IKvStore } from "ldaccess/ikvstore";

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';

let matchIsType = (a: IKvStore) => a.key === LDConsts.type || a.key === LDConsts.isA;
let matchIsLang = (a: IKvStore) => a.key === LDConsts.lang;
let matchIsId = (a: IKvStore) => a.key === LDConsts.id || a.key === LDConsts.iri;

export class DefaultInterpreterMatcher implements IInterpreterMatcher{
	matchSingleKV(single: IKvStore, crudSkills: string): IKvStore {
		throw new Error("Method not implemented.");
	}
	matchKvArray(multi: IKvStore[], crudSkills: string): IKvStore[] {
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
				appIntprtrRetr.searchForObjIntrprtr(searchTerm, crudSkills);
				return;
			}
		}
	}

}
