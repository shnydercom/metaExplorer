import appItptRetrFn from "appconfig/appItptRetriever";
import { HydraClientAPI } from "mods/hydra/apis/hydra-client";

export function initHydraMod() {
	let appIntRetr = appItptRetrFn();
	HydraClientAPI.getHydraAPISingleton();
	//appIntRetr.addItpt(GoogleWebAuthenticatorName, PureGWebAuthenticator, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
}
