import { IModStatus, SingleModStateKeysDict, addBlueprintToRetriever, changeMainAppItpt} from "@metaexplorer/core";
import { UserItptLoadApi } from "./apis/itpt-load-api";
export const MOD_USERITPT_ID = "useritpt";
export const MOD_USERITPT_NAME = "User Block Loader Mod";

export function initUSERITPTClientMod(isMainItptChange: boolean): Promise<IModStatus> {
	//const appIntRetr = appItptRetrFn();
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
