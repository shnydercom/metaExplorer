import { initGoogleMod, MOD_GOOGLE_ID } from "./google/initGoogleMod";
import { initMailchimpMod, MOD_MAILCHIMP_ID } from "./mailchimp/initMailChimpMod";
import { initHydraMod, MOD_HYDRA_ID } from "./hydra/initHydraMod";
import { initSwaggerClientMod, MOD_SWAGGER_ID } from "./swagger-client/initSwaggerClientMod";
import { ModAPI } from "apis/mod-api";
import { MOD_USERITPT_ID, initUSERITPTClientMod } from "./useritpt/initUserItptMod";
import { MOD_ITPTEDITOR_ID, initItptEditorMod } from "./itpt-editor/initItptEditorMod";
import { applicationStore } from "approot";
import { loadMod } from "appstate/epicducks/mod-duck";
import { initQRCODEGENClientMod, MOD_QRCODEGENSCAN_ID } from "./qr-code-genscan/initQRCodeGenScanMod";
import { isProduction } from "appstate/store";

export function initMods(modAPI: ModAPI) {
	//set the required mods (otherwise won't finish to load)

	modAPI.addRequiredMod(MOD_QRCODEGENSCAN_ID);
	modAPI.addRequiredMod(MOD_GOOGLE_ID);
	modAPI.addRequiredMod(MOD_MAILCHIMP_ID);
	modAPI.addRequiredMod(MOD_USERITPT_ID);
	modAPI.addRequiredMod(MOD_ITPTEDITOR_ID);
	//mod initialization functions
	modAPI.addModInitFn(MOD_HYDRA_ID,
		() => initHydraMod()
	);
	modAPI.addModInitFn(MOD_GOOGLE_ID,
		() => initGoogleMod()
	);
	modAPI.addModInitFn(MOD_MAILCHIMP_ID,
		() => initMailchimpMod()
	);
	modAPI.addModInitFn(MOD_SWAGGER_ID,
		() => initSwaggerClientMod()
	);
	modAPI.addModInitFn(MOD_USERITPT_ID,
		() => initUSERITPTClientMod(isProduction)
	);
	modAPI.addModInitFn(MOD_ITPTEDITOR_ID,
		() => initItptEditorMod(!isProduction)
	);
	modAPI.addModInitFn(MOD_QRCODEGENSCAN_ID,
		() => initQRCODEGENClientMod()
	);
	//get data for mods
	applicationStore.dispatch(loadMod(MOD_QRCODEGENSCAN_ID));
	applicationStore.dispatch(loadMod(MOD_GOOGLE_ID));
	applicationStore.dispatch(loadMod(MOD_MAILCHIMP_ID));
	applicationStore.dispatch(loadMod(MOD_SWAGGER_ID));
	applicationStore.dispatch(loadMod(MOD_USERITPT_ID));
	applicationStore.dispatch(loadMod(MOD_ITPTEDITOR_ID));
}
