import appItptRetrFn from "appconfig/appItptRetriever";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { PureGWebAuthenticator, GoogleWebAuthenticatorName } from "./components/GWebAuthenticator";
import { GSheetsRetriever, gSheetsRangeRetrieverName } from "./sidefx/GSheetsRetriever";
import { YoutubeEmbedName, PureYoutubeEmbed } from "./components/YoutubeEmbed";

export function initGoogleServiceItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(GoogleWebAuthenticatorName, PureGWebAuthenticator, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(gSheetsRangeRetrieverName, GSheetsRetriever, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(YoutubeEmbedName, PureYoutubeEmbed, "cRud", [ITPT_TAG_ATOMIC]);
}
