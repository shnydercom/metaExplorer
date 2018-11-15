import appItptRetrFn from "appconfig/appItptRetriever";
import { PureMailChimpSignup, MailChimpSignupName } from "./condensedSignup";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";

export function initMailChimpItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(MailChimpSignupName, PureMailChimpSignup, "cRud", [ITPT_TAG_ATOMIC]);
}
