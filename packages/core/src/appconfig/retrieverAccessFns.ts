import { ldBlueprint, BlueprintConfig } from "../ldaccess/ldBlueprint";
import { ReduxItptRetriever } from "../ld-react-redux-connect/ReduxItptRetriever";
import { getKVStoreByKey } from "../ldaccess/kvConvenienceFns";
import { UserDefDict } from "../ldaccess/UserDefDict";
import { ObjectPropertyRef } from "../ldaccess/ObjectPropertyRef";
import { ITPT_TAG_COMPOUND } from "../ldaccess/iitpt-retriever";
import { appItptRetrFn } from '../appconfig/appItptRetriever';
import { getApplicationStore } from "../approot";
import { LDError } from "../appstate/LDError";
import { ldOptionsDeepCopy } from "../ldaccess/ldUtils";
import { ldOptionsClientSideUpdateAction, ldOptionsClientSideCreateAction } from "../appstate/epicducks/ldOptions-duck";
import { appItptUpdateAction } from "../appstate/epicducks/appCfg-duck";
import { IKvStore } from "../ldaccess/ikvstore";
import { determineSingleKVKey } from "../components/generic/generatorFns";
import { appItptMatcherFn } from "./appItptMatcher";

/**
 * adds a blueprint defined in the editor to the AppItptRetriever, automatically looks
 * for the correct React-Class to extend
 * @param input the BlueprintConfig used as a setup for the new Itpt
 */
export const addBlueprintToRetriever = (input: BlueprintConfig, retrieverName?: string): void => {
	let retriever = retrieverName ? appItptMatcherFn().getItptRetriever(retrieverName) as ReduxItptRetriever : appItptRetrFn() as ReduxItptRetriever;
	if (!retriever) throw new LDError("retriever " + retrieverName + " not found");
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
			if (propID) {
				rv[propID] = null;
			} else if (val) {
				const kv = getKVStoreByKey(input.initialKvStores, val as string);
				if (!kv) {
					let skvKey = determineSingleKVKey(input.initialKvStores, input.canInterpretType, input.interpretableKeys as string[]);
					if (skvKey) {
						rv[val as string] = getKVStoreByKey(input.initialKvStores, skvKey).value[val as string];
						return;
					}
				}
				rv[val as string] = kv.value;
			}
		} catch (error) {
			rv[val as string] = null;
		}
	});
	return rv;
};

export const changeMainAppItpt = (toItptName: string, startingInstance?: IKvStore[]): void => {
	const appState = getApplicationStore().getState();
	const appKey = appState.appCfg.appKey;
	//this.generatePrefilled(val.itptList[numItpts - 1]);
	let newItpt = appItptRetrFn().getItptByNameSelf(toItptName);
	if (!newItpt) throw new LDError("error in interpreterAPI: could not find " + toItptName);
	let newItptCfg = { ...newItpt.cfg } as BlueprintConfig;
	newItptCfg.initialKvStores = startingInstance;
	let newType = newItptCfg.canInterpretType;
	let dummyInstance = intrprtrTypeInstanceFromBlueprint(newItptCfg);
	const appKvKey = appKey + "KvKey";
	if (appState.ldoptionsMap[appKey]) {
		let newLDOptions = ldOptionsDeepCopy(appState.ldoptionsMap[appKey]);
		newLDOptions.resource.kvStores = [
			{ key: appKvKey, ldType: newType, value: dummyInstance }
		];
		getApplicationStore().dispatch(ldOptionsClientSideUpdateAction(newLDOptions));
	} else {
		let kvStores: IKvStore[] = [
			{ key: appKvKey, ldType: newType, value: dummyInstance }
		];
		let lang: string;
		let alias: string = appKey;
		getApplicationStore().dispatch((ldOptionsClientSideCreateAction(kvStores, lang, alias)));
	}
	getApplicationStore().dispatch(appItptUpdateAction(toItptName));
};
