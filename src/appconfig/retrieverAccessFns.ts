import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { UserDefDict } from "ldaccess/UserDefDict";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { ITPT_TAG_COMPOUND } from "ldaccess/iitpt-retriever";
import appIntprtrRetr from 'appconfig/appItptRetriever';

/**
 * adds a blueprint defined in the editor to the AppItptRetriever, automatically looks
 * for the correct React-Class to extend
 * @param input the BlueprintConfig used as a setup for the new Itpt
 */
export const addBlueprintToRetriever = (input: BlueprintConfig) => {
	let retriever = appIntprtrRetr() as ReduxItptRetriever;
	let candidate = retriever.getUnconnectedByNameSelf(input.subItptOf);
	if (!candidate) {
		//check if it's well-defined
		let refMap = getKVStoreByKey(input.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);
		if (!refMap || !refMap.value || refMap.value === {}) return;
		if (!refMap.value[input.subItptOf]) return;
		let searchTerm: string = UserDefDict.intrprtrBPCfgRefMapName;
		candidate = retriever.getUnconnectedByNameSelf(searchTerm);
	}
	if (!candidate) return;
	let itptContainer: any = ldBlueprint(input)(candidate); //actually wraps, doesn't extend
	retriever.addItpt(input.canInterpretType, itptContainer, "cRud", [ITPT_TAG_COMPOUND]);
};

export const intrprtrTypeInstanceFromBlueprint = (input: BlueprintConfig): any => {
	if (!input) return null;
	let rv = {};
	input.interpretableKeys.forEach((val) => {
		try {
			let propID: string = (val as ObjectPropertyRef).propRef;
			rv[propID] = null;
		} catch (error) {
			rv[val as string] = null;
		}
	});
	return rv;
};
