import { IModStatus, SingleModStateKeysDict, addBlueprintToRetriever, changeMainAppItpt, appItptRetrFn, ITPT_TAG_ATOMIC } from "@metaexplorer/core";
import { UserItptLoadApi } from "./apis/itpt-load-api";
import { RefMapBpCfgSenderName, RefMapBpCfgSender } from "./components/RefMapBpCfgSender";
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
			if (numItpts > 0 && val.mainItpt) {
				const userName = val.mainItpt.split("/")[0];
				api.loadUserStyleSheet(userName).catch(() => console.warn("not getting styles for user " + userName));
			}
			appIntRetr.addItpt(RefMapBpCfgSenderName, RefMapBpCfgSender, "crud", [ITPT_TAG_ATOMIC]);
			resolve({ id: MOD_USERITPT_ID, name: MOD_USERITPT_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		}).catch((reason) => {
			reject(reason);
		});
	});
	return rv;
}
