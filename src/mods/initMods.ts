import { initGoogleServiceItpts } from "./google/initGoogleServiceItpts";
import { initMailChimpItpts } from "./mailchimp/initMailChimp";

export function initMods() {
	initGoogleServiceItpts();
	initMailChimpItpts();
}
