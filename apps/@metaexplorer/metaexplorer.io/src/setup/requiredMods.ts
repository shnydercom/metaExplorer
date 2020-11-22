import { changeMainAppItpt, IModSpec, SingleModStateKeysDict } from '@metaexplorer/core';
import { MOD_MATERIALDESIGN_ID, initMaterialDesignMod } from '@metaexplorer-mods/material-design';
import { MOD_USERITPT_ID, initUSERITPTClientMod } from '@metaexplorer-mods/useritpt';
import { MOD_ITPTEDITOR_ID, initItptEditorMod } from '@metaexplorer-mods/itpt-editor';
import { MOD_QRCODEGENSCAN_ID, initQRCODEGENClientMod } from '@metaexplorer-mods/qr-code-genscan';
import { initMetaExplorerMod, MOD_METAEXPLORERIO_ID } from '@metaexplorer-mods/metaexplorer.io';
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
		id: MOD_ITPTEDITOR_ID,
		initFn: () => initItptEditorMod(),
		dependencies: []
	}
	);
	modSpecs.push({
		id: MOD_USERITPT_ID,
		initFn: () => initUSERITPTClientMod(isProduction),
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
		id: MOD_METAEXPLORERIO_ID,
		initFn: () => initMetaExplorerMod(),
		dependencies: [MOD_USERITPT_ID]
	});
	//the final app is also a mod
	const MOD_NAME = "mxp-init-name";
	const MOD_ID = "mxp-init-id";
	modSpecs.push({
		id: MOD_ID,
		initFn: () => {
			const startItpt = "metaexplorer.io/v3/landing/google-using-structured-data/index";
			changeMainAppItpt(startItpt, []);
			return new Promise((resolve, reject) => {
				resolve({
					id: MOD_ID,
					name: MOD_NAME,
					state: SingleModStateKeysDict.readyToUse
				});
			});
		},
		dependencies: [MOD_METAEXPLORERIO_ID]
	}
	);
	return modSpecs;
}
