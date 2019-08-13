import { IModSpec } from '@metaexplorer/core';
import { MOD_MATERIALDESIGN_ID, initMaterialDesignMod } from '@metaexplorer-mods/material-design';

import { MOD_KEYCLOAK_ID, initKeycloakMod } from '@metaexplorer-mods/keycloak';
import { MOD_DEMO_ID, initDemoMod } from '@metaexplorer-mods/demo';
import { MOD_GOOGLE_ID, initGoogleMod } from '@metaexplorer-mods/google';
import { MOD_MAILCHIMP_ID, initMailchimpMod } from '@metaexplorer-mods/mailchimp';
import { MOD_USERITPT_ID, initUSERITPTClientMod } from '@metaexplorer-mods/useritpt';
import { MOD_ITPTEDITOR_ID, initItptEditorMod } from '@metaexplorer-mods/itpt-editor';
import { MOD_QRCODEGENSCAN_ID, initQRCODEGENClientMod } from '@metaexplorer-mods/qr-code-genscan';
import { initOnboardingMod, MOD_ONBOARDING_ID } from '@metaexplorer-mods/onboarding';
import { initShnyderMod, MOD_SHNYDER_ID } from '@metaexplorer-mods/shnyder';
import { isProduction } from '@metaexplorer/core';

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
	}
	);*/
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
	modSpecs.push({
		id: MOD_SHNYDER_ID,
		initFn: () => initShnyderMod(),
		dependencies: [MOD_ONBOARDING_ID]
	});
	return modSpecs;
}
