import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { UserItptLoadApi } from "./apis/itpt-load-api";
import { PureLDApproot } from "ldapproot";
import { addBlueprintToRetriever, intrprtrTypeInstanceFromBlueprint } from "appconfig/retrieverAccessFns";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDError } from "appstate/LDError";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { applicationStore } from "approot";
import { ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { appItptUpdateAction } from "appstate/epicducks/appCfg-duck";

export const MOD_USERITPT_ID = "useritpt";
export const MOD_USERITPT_NAME = "OpenAPI Mod";

export function initUSERITPTClientMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		let api = UserItptLoadApi.getUserItptLoadApiSingleton();
		api.getItptsForCurrentUser()().then((val) => {
			let numItpts = val.itptList.length;
			val.itptList.forEach((itpt) => {
				addBlueprintToRetriever(itpt);
			});
			if (numItpts > 0) {
				const appState =  applicationStore.getState();
				const appKey = appState.appCfg.appKey;
				//this.generatePrefilled(val.itptList[numItpts - 1]);
				let newItpt = appItptRetrFn().getItptByNameSelf(val.mainItpt);
				if (!newItpt) throw new LDError("error in interpreterAPI: could not find " + val.mainItpt);
				let newItptCfg = newItpt.cfg as BlueprintConfig;
				let newType = newItptCfg.canInterpretType;
				let dummyInstance = intrprtrTypeInstanceFromBlueprint(newItptCfg);
				let newLDOptions = ldOptionsDeepCopy(appState.ldoptionsMap[appKey]);
				newLDOptions.resource.kvStores = [
					{ key: appKey, ldType: newType, value: dummyInstance }
				];
				applicationStore.dispatch(ldOptionsClientSideUpdateAction(newLDOptions));
			}
			applicationStore.dispatch(appItptUpdateAction(val.mainItpt));
			resolve({ id: MOD_USERITPT_ID, name: MOD_USERITPT_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		}).catch((reason) => {
			reject(reason);
		});
	});
	return rv;
}
