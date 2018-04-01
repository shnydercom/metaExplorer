import { applicationStore } from "approot";
import { ConsumeLDOptionsFunc, IBlueprintItpt } from "ldaccess/ldBlueprint";
import { ILDOptionsMapStatePart } from "appstate/store";
import { isLDOptionsSame } from "ldaccess/ldUtils";

const connectedMap: Map<string, IBlueprintItpt> = new Map();
let lastLDOptionsMap: ILDOptionsMapStatePart = null;
const nonVisListener = () => {
	let state = applicationStore.getState();
	connectedMap.forEach((bpIntrprtr, key) => {
		let ldOptions = state.ldoptionsMap[key];
		if (!ldOptions) return;
		if (lastLDOptionsMap && isLDOptionsSame(lastLDOptionsMap[key], ldOptions)) return;
		bpIntrprtr.consumeLDOptions(ldOptions);
	});
	lastLDOptionsMap = state.ldoptionsMap;
};

export const initLDConnect = () => {
	applicationStore.subscribe(nonVisListener);
};

export const connectNonVisLDComp = (alias: string, interpreter: IBlueprintItpt) => {
	if (connectedMap.get(alias) && connectedMap.get(alias).cfg === interpreter.cfg) return;
	connectedMap.set(alias, interpreter);
};
