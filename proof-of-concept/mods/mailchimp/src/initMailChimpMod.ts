import {appItptRetrFn, ITPT_TAG_ATOMIC, SingleModStateKeysDict, IModStatus } from "@metaexplorer/core";
import { PureMailChimpSignup, MailChimpSignupName } from "./condensedSignup";

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
