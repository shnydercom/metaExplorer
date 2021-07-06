import { appItptRetrFn, ITPT_TAG_ATOMIC, ITPT_TAG_MOD, SingleModStateKeysDict, IModStatus } from "@metaexplorer/core";
import { PureGWebAuthenticator, GoogleWebAuthenticatorName } from "./components/GWebAuthenticator";
import { GSheetsRetriever, gSheetsRangeRetrieverName } from "./sidefx/GSheetsRetriever";
import { YoutubeEmbedName, PureYoutubeEmbed } from "./components/YoutubeEmbed";

export const MOD_GOOGLE_ID = "google";
export const MOD_GOOGLE_NAME = "Google Mod";

export function initGoogleMod() {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		appIntRetr.addItpt(GoogleWebAuthenticatorName, PureGWebAuthenticator, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		appIntRetr.addItpt(gSheetsRangeRetrieverName, GSheetsRetriever, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		appIntRetr.addItpt(YoutubeEmbedName, PureYoutubeEmbed, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		resolve({ id: MOD_GOOGLE_ID, name: MOD_GOOGLE_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
