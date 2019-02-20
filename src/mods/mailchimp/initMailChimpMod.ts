import appItptRetrFn from "appconfig/appItptRetriever";
import { PureMailChimpSignup, MailChimpSignupName } from "./condensedSignup";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { SingleModStateKeysDict, IModStatus } from "appstate/modstate";

export const MOD_MAILCHIMP_ID = "mailchimp";
export const MOD_MAILCHIMP_NAME = "Mailchimp Mod";

export function initMailchimpMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		appIntRetr.addItpt(MailChimpSignupName, PureMailChimpSignup, "cRud", [ITPT_TAG_ATOMIC]);
		resolve({ id: MOD_MAILCHIMP_ID, name: MOD_MAILCHIMP_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
