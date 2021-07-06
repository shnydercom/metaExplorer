import appItptRetrFn from "appconfig/appItptRetriever";
import { HydraClientAPI } from "mods/hydra/apis/hydra-client";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";

export const MOD_HYDRA_ID = "HYDRA";
export const MOD_HYDRA_NAME = "Hydra Mod";

export function initHydraMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		HydraClientAPI.getHydraAPISingleton();
		resolve({ id: MOD_HYDRA_ID, name: MOD_HYDRA_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null});
	} );
	return rv;
}
