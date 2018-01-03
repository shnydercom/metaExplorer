import { applicationStore } from "approot";
import { ConsumeLDOptionsFunc, IBlueprintInterpreter } from "ldaccess/ldBlueprint";

const connectedMap: Map<string, IBlueprintInterpreter> = new Map();
const nonVisListener = () => {
	let state = applicationStore.getState();
	connectedMap.forEach((bpIntrprtr, key) => {
		let ldOptions = state.ldoptionsMap[key];
		if (!ldOptions) return;
		bpIntrprtr.consumeLDOptions(ldOptions);
	});
};

export const initLDConnect = () => { applicationStore.subscribe(nonVisListener); };

export const connectNonVisLDComp = (alias: string, interpreter: IBlueprintInterpreter) => {
	if (connectedMap.get(alias) && connectedMap.get(alias).cfg === interpreter.cfg) return;
	connectedMap.set(alias, interpreter);
};
