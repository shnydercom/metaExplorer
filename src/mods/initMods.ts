import { initGoogleMod } from "./google/initGoogleMod";
import { initMailChimpItpts } from "./mailchimp/initMailChimp";
import { initHydraMod } from "./hydra/initHydraMod";

export function initMods() {
	initHydraMod();
	initGoogleMod();
	initMailChimpItpts();
}
