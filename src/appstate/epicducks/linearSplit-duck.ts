import { ILDOptionsMapStatePart } from "../store";
import { ILDOptions } from "ldaccess/ildoptions";
import { LDAction } from "./ldOptions-duck";
import { linearLDTokenStr, NetworkPreferredToken } from "ldaccess/ildtoken";
import { isLDOptionsSame } from "ldaccess/ldUtils";
import { appItptMatcherFn } from "appconfig/appInterpreterMatcher";

/**
 * a duck for linear state splitting, used for containers.
 * Note: No epic has been added yet
 */

export const LINEAR_SPLIT = 'shnyder/LINEAR_SPLIT';

export type LinearSplitAction = { type: 'shnyder/LINEAR_SPLIT', ldOptionsBase: ILDOptions };

//Action factories, return action Objects

export const linearSplitAction = (updatedLDOptions: ILDOptions): LinearSplitAction => ({ type: LINEAR_SPLIT, ldOptionsBase: updatedLDOptions });

export const linearReducer = (
	state: ILDOptionsMapStatePart = {}, action: LinearSplitAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case LINEAR_SPLIT:
			let ldOptionsBase = action.ldOptionsBase;
			let ldTkStr = action.ldOptionsBase.ldToken.get();
			if (ldOptionsBase.isLoading) return state;
			let stateCopy = { ...state };
			removePrevSplit(stateCopy, ldTkStr);
			splitValues(stateCopy, action);
			stateCopy[ldTkStr] = ldOptionsBase;
			return stateCopy;
		default:
			break;
	}
	return state;
};

function removePrevSplit(stateCopy: ILDOptionsMapStatePart, ldTkStr: string) {
	let kvStores = stateCopy[ldTkStr].resource.kvStores;
	kvStores.forEach((itm, idx) => {
		stateCopy[linearLDTokenStr(ldTkStr, idx)] = undefined;
	});
}

function splitValues(stateCopy: ILDOptionsMapStatePart, action: LinearSplitAction) {
	let ldOptionsObj = action.ldOptionsBase;
	let ldTkStr = ldOptionsObj.ldToken.get();
	let lang = ldOptionsObj.lang;
	let retriever = ldOptionsObj.visualInfo.retriever;
	ldOptionsObj.resource.kvStores.forEach((itm, idx) => {
		let newLDTokenStr: string = linearLDTokenStr(ldTkStr, idx);
		let newLDToken = new NetworkPreferredToken(newLDTokenStr);
		assignDerivedItpt(retriever, newLDTokenStr, itm.ldType, "cRud");
		let newLDOptions: ILDOptions = {
			isLoading: false,
			lang: lang,
			ldToken: newLDToken,
			visualInfo: { retriever: retriever },
			resource: {
				webInResource: null,
				webOutResource: null,
				kvStores: [itm]
			}
		};
		stateCopy[newLDToken.get()] = newLDOptions;
	});
}

function assignDerivedItpt(retriever: string, newLDTokenStr: string, ldType: string, crudSkills: string): void {
	let baseItpt = appItptMatcherFn().getItptRetriever(retriever).searchForObjItpt(ldType, crudSkills);
	appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(newLDTokenStr, baseItpt);
}

function clearDerivedItpt(retriever: string, oldLDTokenStr: string) {
	if (appItptMatcherFn().getItptRetriever(retriever).hasDerivedItpt(oldLDTokenStr)) {
		appItptMatcherFn().getItptRetriever(retriever).setDerivedItpt(oldLDTokenStr, null);
	}
}
