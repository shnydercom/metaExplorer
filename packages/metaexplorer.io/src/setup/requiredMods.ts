import { IModSpec } from '@metaexplorer/core/src/apis/mod-api';
import { MOD_MATERIALDESIGN_ID, initMaterialDesignMod } from '@metaexplorer-mods/material-design';

export function setupRequiredMods(): IModSpec[] {
	//mod initialization functions
	const modSpecs: IModSpec[] = [];
	modSpecs.push({
		id: MOD_MATERIALDESIGN_ID,
		initFn: () => initMaterialDesignMod(),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_KEYCLOAK_ID,
		initFn: () => initKeycloakMod(),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_DEMO_ID,
		initFn: () => initDemoMod(),
		dependencies: []
	}
	);
	/*modAPI.addModInitFn(MOD_HYDRA_ID,
		() => initHydraMod(),
		[]
	);*/
	modSpecs.push({
		id: MOD_GOOGLE_ID,
		initFn: () => initGoogleMod(),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_MAILCHIMP_ID,
		initFn: () => initMailchimpMod(),
		dependencies: []
	}
	);
	/*modSpecs.push({
		id: MOD_SWAGGER_ID,
		initFn: () => initSwaggerClientMod(),
		dependencies: []
	}*/
	);
	modSpecs.push({
		id: MOD_USERITPT_ID,
		initFn: () => initUSERITPTClientMod(isProduction),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_ITPTEDITOR_ID,
		initFn: () => initItptEditorMod(!isProduction),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_QRCODEGENSCAN_ID,
		initFn: () => initQRCODEGENClientMod(),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_ONBOARDING_ID,
		initFn: () => initOnboardingMod(),
		dependencies: [MOD_QRCODEGENSCAN_ID]
	}
	);
	return modSpecs;
}
