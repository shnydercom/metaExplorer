import { initGoogleMod, MOD_GOOGLE_ID } from "../../../../mods/google/src/initGoogleMod";
import { initMailchimpMod, MOD_MAILCHIMP_ID } from "../../../../mods/mailchimp/src/initMailChimpMod";
// import { initHydraMod, MOD_HYDRA_ID } from "./hydra/initHydraMod";
import { initSwaggerClientMod, MOD_SWAGGER_ID } from "../../../../mods/swagger-client/src/initSwaggerClientMod";
import { ModAPI } from "apis/mod-api";
import { MOD_USERITPT_ID, initUSERITPTClientMod } from "../../../../mods/useritpt/src/initUserItptMod";
import { MOD_ITPTEDITOR_ID, initItptEditorMod } from "../../../../mods/itpt-editor/src/initItptEditorMod";
import { applicationStore } from "approot";
import { loadMod } from "appstate/epicducks/mod-duck";
import { initQRCODEGENClientMod, MOD_QRCODEGENSCAN_ID } from "../../../../mods/qr-code-genscan/src/initQRCodeGenScanMod";
import { isProduction } from "appstate/store";
import { MOD_ONBOARDING_ID, initOnboardingMod } from "../../../../mods/onboarding/src/initOnboarding";
import { MOD_KEYCLOAK_ID, initKeycloakMod } from "../../../../mods/keycloak/src/initKeyCloakMod";
import { MOD_DEMO_ID, initDemoMod } from "../../../../mods/demo/src/initDemoMod";
import { MOD_MATERIALDESIGN_ID, initMaterialDesignMod } from "../../../../mods/material-design/src/initMaterialDesign";

export function initMods(modAPI: ModAPI) {
	//set the required mods (otherwise won't finish to load)
	modAPI.addRequiredMod(MOD_MATERIALDESIGN_ID);
	modAPI.addRequiredMod(MOD_KEYCLOAK_ID);
	modAPI.addRequiredMod(MOD_DEMO_ID);
	modAPI.addRequiredMod(MOD_QRCODEGENSCAN_ID);
	modAPI.addRequiredMod(MOD_GOOGLE_ID);
	modAPI.addRequiredMod(MOD_MAILCHIMP_ID);
	modAPI.addRequiredMod(MOD_USERITPT_ID);
	modAPI.addRequiredMod(MOD_ITPTEDITOR_ID);
	modAPI.addRequiredMod(MOD_ONBOARDING_ID);
	//mod initialization functions
	modAPI.addModInitFn(MOD_MATERIALDESIGN_ID,
		() => initMaterialDesignMod(),
		[]
	);
	modAPI.addModInitFn(MOD_KEYCLOAK_ID,
		() => initKeycloakMod(),
		[]
	);
	modAPI.addModInitFn(MOD_DEMO_ID,
		() => initDemoMod(),
		[]
	);
	/*modAPI.addModInitFn(MOD_HYDRA_ID,
		() => initHydraMod(),
		[]
	);*/
	modAPI.addModInitFn(MOD_GOOGLE_ID,
		() => initGoogleMod(),
		[]
	);
	modAPI.addModInitFn(MOD_MAILCHIMP_ID,
		() => initMailchimpMod(),
		[]
	);
	modAPI.addModInitFn(MOD_SWAGGER_ID,
		() => initSwaggerClientMod(),
		[]
	);
	modAPI.addModInitFn(MOD_USERITPT_ID,
		() => initUSERITPTClientMod(isProduction),
		[]
	);
	modAPI.addModInitFn(MOD_ITPTEDITOR_ID,
		() => initItptEditorMod(!isProduction),
		[]
	);
	modAPI.addModInitFn(MOD_QRCODEGENSCAN_ID,
		() => initQRCODEGENClientMod(),
		[]
	);
	modAPI.addModInitFn(MOD_ONBOARDING_ID,
		() => initOnboardingMod(),
		[MOD_QRCODEGENSCAN_ID]
	);
	//get data for mods
	applicationStore.dispatch(loadMod(MOD_MATERIALDESIGN_ID));
	applicationStore.dispatch(loadMod(MOD_KEYCLOAK_ID));
	applicationStore.dispatch(loadMod(MOD_DEMO_ID));
	applicationStore.dispatch(loadMod(MOD_QRCODEGENSCAN_ID));
	applicationStore.dispatch(loadMod(MOD_GOOGLE_ID));
	applicationStore.dispatch(loadMod(MOD_MAILCHIMP_ID));
	//applicationStore.dispatch(loadMod(MOD_SWAGGER_ID));
	applicationStore.dispatch(loadMod(MOD_USERITPT_ID));
	applicationStore.dispatch(loadMod(MOD_ITPTEDITOR_ID));
	applicationStore.dispatch(loadMod(MOD_ONBOARDING_ID));
}
