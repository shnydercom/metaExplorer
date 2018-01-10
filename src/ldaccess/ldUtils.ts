import { OBJECT_REF } from "ldaccess/ObjectPropertyRef";
import { ILDOptions } from "ldaccess/ildoptions";
import { ILDResource } from "ldaccess/ildresource";
import { IKvStore } from "ldaccess/ikvstore";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";
import { elementAt } from "rxjs/operator/elementAt";
import { OutputKVMap } from "ldaccess/ldBlueprint";

export const isInterpreter = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty("cfg");
};

export const isUID = (input: string): boolean => {
	let regExp = new RegExp("^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$");
	return regExp.test(input);
};

export const isObjPropertyRef = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty(OBJECT_REF);
};

/**
 * 	//iterates and return false at first non-equal value. Only checks KvStores, not the whole Resource!
 * @param a one of the ldOptions-Obj to compare
 * @param b the other ldOptions-Obj
 */
export const isLDOptionsSame = (a: ILDOptions, b: ILDOptions): boolean => {
	if ((!a || !b) && !(!a && !b)) return false;
	if (a.isLoading !== b.isLoading) return false;
	if (a.lang !== b.lang) return false;
	if (a.ldToken !== b.ldToken) return false;
	if (!a.resource && !b.resource) return true;
	if (!(a.resource && b.resource)) return false;
	let kvsA = a.resource.kvStores;
	let kvsB = b.resource.kvStores;
	if (kvsA.length !== kvsB.length) return false;
	if (a.resource.webInResource !== b.resource.webInResource) return false;
	if (a.resource.webOutResource !== b.resource.webOutResource) return false; //TODO: resources could have shallow object checks
	let isKVsSame: boolean = kvsA.every((aVal, idx: number) => {
		let bVal = kvsB[idx];
		if (aVal.key !== bVal.key) return false;
		if (aVal.ldType !== bVal.ldType) return false;
		if (aVal.value !== bVal.value) return false;
		if (aVal.intrprtrClass !== bVal.intrprtrClass) return false;
		return true;
	});
	return isKVsSame;
};

export const ldOptionsDeepCopy = (input: ILDOptions): ILDOptions => {
	let rv: ILDOptions;
	let newKVStores: IKvStore[] = [];
	input.resource.kvStores.forEach((elem) => {
		let newKey = elem.key ? "" + elem.key : null;
		let newValue = null;
		let valType = typeof elem.value;
		if (elem.value) {
			if (valType === 'object') {
				newValue = { ...elem.value };
			} else {
				newValue = elem.value;
			}
		}
		if (valType === 'boolean' || valType === 'number')
			newValue = elem.value;
		let newLDType = elem.ldType ? "" + elem.ldType : null;
		let newKvSingle: IKvStore = {
			intrprtrClass: elem.intrprtrClass,
			key: newKey,
			value: newValue,
			ldType: newLDType
		};
		newKVStores.push(newKvSingle);
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

export const isOutputKVSame = (a: OutputKVMap, b: OutputKVMap): boolean => {
	if ((!a || !b) && !(!a && !b)) return false;
	let pnsA = Object.getOwnPropertyNames(a);
	let pnsB = Object.getOwnPropertyNames(b);
	if (pnsA.length !== pnsB.length) return false;
	let isSame = pnsA.every((aPN, idx: number) => {
		let aVal = a[aPN];
		let bVal = b[aPN];
		if (aVal.targetProperty !== bVal.targetProperty) return false;
		if (aVal.targetLDToken.get() !== bVal.targetLDToken.get()) return false;
		return true;
	});
	return isSame;
};

export const getKVValue = (input: IKvStore): any => {
	if (typeof input !== 'object') return input;
	if (!input || input.value === null || input.value === undefined) return null;
	if (input.value.constructor === Array) {
		if ((input.value as Array<any>).length === 1) return input.value[0];
	}
	return input.value;
};
