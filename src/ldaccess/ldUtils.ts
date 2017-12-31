import { OBJECT_REF } from "ldaccess/ObjectPropertyRef";
import { ILDOptions } from "ldaccess/ildoptions";
import { ILDResource } from "ldaccess/ildresource";
import { IKvStore } from "ldaccess/ikvstore";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";
import { elementAt } from "rxjs/operator/elementAt";

export let isInterpreter = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty("cfg");
};

export let isUID = (input: string): boolean => {
	let regExp = new RegExp("^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$");
	return regExp.test(input);
};

export let isObjPropertyRef = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty(OBJECT_REF);
};

/**
 * 	//iterates and return false at first non-equal value. Only checks KvStores, not the whole Resource!
 * @param a one of the ldOptions-Obj to compare
 * @param b the other ldOptions-Obj
 */
export let isLDOptionsSame = (a: ILDOptions, b: ILDOptions): boolean => {
	if (a.isLoading !== b.isLoading) return false;
	if (a.lang !== b.lang) return false;
	if (a.ldToken !== b.ldToken) return false;
	if (!a.resource && !b.resource) return true;
	if (!(a.resource && b.resource)) return false;
	let kvsA = a.resource.kvStores;
	let kvsB = b.resource.kvStores;
	if (kvsA.length !== kvsB.length) return false;
	kvsA.forEach((aVal, idx: number) => {
		let bVal = kvsB[idx];
		if (aVal.key !== bVal.key) return false;
		if (aVal.ldType !== bVal.ldType) return false;
		if (aVal.value !== bVal.value) return false;
		if (aVal.intrprtrClass !== bVal.intrprtrClass) return false;
	});
	return true;
};

export let ldOptionsDeepCopy = (input: ILDOptions): ILDOptions => {
	let rv: ILDOptions;
	let newKVStores: IKvStore[] = [];
	input.resource.kvStores.forEach((elem) => {
		let newKey = elem.key ? "" + elem.key : null;
		let newValue = elem.value ? {...elem.value} : null;
		let newLDType = elem.ldType ? "" + elem.ldType : null;
		let newKvSingle: IKvStore = {
			intrprtrClass: elem.intrprtrClass,
			key: newKey,
			value: newValue,
			ldType: newLDType
		};
	});
	let newWebInResource: IWebResource;
	let newWebOutResource: string;
	let newResource: ILDResource = { kvStores: newKVStores, webOutResource: newWebOutResource, webInResource: newWebInResource };
	rv = {
		...input,
		resource: newResource
	};
	return rv;
};
