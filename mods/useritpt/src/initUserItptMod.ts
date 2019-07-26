import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { UserItptLoadApi } from "./apis/itpt-load-api";
import { PureLDApproot } from "ldapproot";
import { addBlueprintToRetriever, intrprtrTypeInstanceFromBlueprint, changeMainAppItpt } from "appconfig/retrieverAccessFns";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDError } from "appstate/LDError";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { applicationStore } from "approot";
import { ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { appItptUpdateAction } from "appstate/epicducks/appCfg-duck";

export const MOD_USERITPT_ID = "useritpt";
export const MOD_USERITPT_NAME = "User Block Loader Mod";

export function initUSERITPTClientMod(isMainItptChange: boolean): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		let api = UserItptLoadApi.getUserItptLoadApiSingleton();
		api.getItptsUnauthed()().then((val) => {
			let numItpts = val.itptList.length;
			val.itptList.forEach((itpt) => {
				addBlueprintToRetriever(itpt);
			});
			if (numItpts > 0 && isMainItptChange) {
				changeMainAppItpt(val.mainItpt);
			}
			resolve({ id: MOD_USERITPT_ID, name: MOD_USERITPT_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		}).catch((reason) => {
			reject(reason);
		});
	});
	return rv;
}
