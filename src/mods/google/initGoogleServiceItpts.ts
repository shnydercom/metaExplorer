import appItptRetrFn from "appconfig/appItptRetriever";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { PureGWebAuthenticator, GoogleWebAuthenticatorName } from "./components/GWebAuthenticator";

export function initGoogleServiceItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(GoogleWebAuthenticatorName, PureGWebAuthenticator, "cRud", [ITPT_TAG_ATOMIC]);
}