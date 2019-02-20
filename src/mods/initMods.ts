import { initGoogleMod, MOD_GOOGLE_ID } from "./google/initGoogleMod";
import { initMailchimpMod, MOD_MAILCHIMP_ID } from "./mailchimp/initMailChimpMod";
import { initHydraMod, MOD_HYDRA_ID } from "./hydra/initHydraMod";
import { initSwaggerClientMod, MOD_SWAGGER_ID } from "./swagger-client/initSwaggerClientMod";
import { ModAPI } from "apis/mod-api";
import { MOD_USERITPT_ID, initUSERITPTClientMod } from "./useritpt/initUserItptMod";

export function initMods(modAPI: ModAPI) {
	modAPI.addModInitFn(MOD_HYDRA_ID,
		() => initHydraMod
	);
	modAPI.addModInitFn(MOD_GOOGLE_ID,
		() => initGoogleMod
	);
	modAPI.addModInitFn(MOD_MAILCHIMP_ID,
		() => initMailchimpMod
	);
	modAPI.addModInitFn(MOD_SWAGGER_ID,
		() => initSwaggerClientMod
	);
	modAPI.addModInitFn(MOD_USERITPT_ID,
		() => initUSERITPTClientMod
	);
	modAPI.getModData(MOD_USERITPT_ID);
}
