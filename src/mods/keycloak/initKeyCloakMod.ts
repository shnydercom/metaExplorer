import appItptRetrFn from "appconfig/appItptRetriever";
//import { PureMailChimpSignup, MailChimpSignupName } from "./condensedSignup";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { SingleModStateKeysDict, IModStatus } from "appstate/modstate";
import { KeyCloakAuthCfg, kcloakAuthCfgName } from "./sidefx/KeyCloakAuthCfg";

export const MOD_KEYCLOAK_ID = "keycloak";
export const MOD_KEYCLOAK_NAME = "Keycloak Mod";

export function initKeycloakMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		appIntRetr.addItpt(kcloakAuthCfgName, KeyCloakAuthCfg, "cRud", [ITPT_TAG_ATOMIC]);
		resolve({ id: MOD_KEYCLOAK_ID, name: MOD_KEYCLOAK_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
