import { KVL, LDDict, ldBlueprint, BlueprintConfig, UserDefDict, initLDLocalState,AbstractDataTransformer } from "@metaexplorer/core";
import { KeyCloakAuthAPI, EVENT_KEYCLOAK_WEB_AUTH } from "../apis/KeyCloakAuthAPI";

export const kcloakAuthCfgName = "keycloak/auth/config";
export const jsonCfgPath = "jsonConfigurationPath";
export const isAuthenticated = "isAuthenticated";
export const tokenStr = "bearertoken";
export const kcCfgItptKeys = [jsonCfgPath];
export const kcCfgOutputKvs = [
	{
		key: isAuthenticated,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: tokenStr,
		value: undefined,
		ldType: LDDict.Text
	}
];

let ownKVLs: KVL[] = [
	{
		key: jsonCfgPath,
		value: undefined,
		ldType: LDDict.Text
	},
	...kcCfgOutputKvs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: kcloakAuthCfgName,
	ownKVLs: ownKVLs,
	inKeys: kcCfgItptKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class KeyCloakAuthCfg extends AbstractDataTransformer {
	kcAPI: KeyCloakAuthAPI;

	constructor(ldTkStr?: string) {
		super(ldTkStr);
		const ldState = initLDLocalState(this.cfg, null, [], [...kcCfgItptKeys, UserDefDict.outputKVMapKey]);
		if (ldState.localValues.has(jsonCfgPath)) {
			this.inputParams.set(jsonCfgPath, {
				key: jsonCfgPath,
				value: ldState.localValues.get(jsonCfgPath),
				ldType: LDDict.Text
			}
			);
		}
		this.initKCApi();
		this.itptKeys = kcCfgItptKeys;
		this.outputKvStores = kcCfgOutputKvs;
		this.kcAPI = KeyCloakAuthAPI.getKeyCloakAuthAPISingleton();
		this.kcAPI.addEventListener(EVENT_KEYCLOAK_WEB_AUTH,
			(event) => {
				this.propagateChange();
			});
		this.propagateChange();
	}

	initKCApi = () => {
		if (!this.kcAPI) {
			let jsonCfgKv = this.inputParams.get(jsonCfgPath);
			if (!!jsonCfgKv) {
				let jsonCfgString = jsonCfgKv.value;
				if (!jsonCfgString) return;
				this.kcAPI = KeyCloakAuthAPI.getKeyCloakAuthAPISingleton(jsonCfgString);
			}
		}
	}

	protected propagateChange() {
		let outputKVMap: KVL = this.cfg.ownKVLs.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		this.isOutputDirty = true;
		this.evalDirtyOutput();
	}

	/**
 * this function gets the current token from the KeyCloakAuthAPI
 * @param inputParams --isn't used here
 * @param outputKvStores
 */
	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];
		//let jsonCfgStr = inputParams.get(jsonCfgPath);
		const tokenOutputKV = outputKvStores.get(tokenStr);
		tokenOutputKV.value = this.kcAPI.getState().token;
		const isAuthKv = outputKvStores.get(isAuthenticated);
		isAuthKv.value = this.kcAPI.getState().isAuthenticated;
		rv = [
			isAuthKv,
			tokenOutputKV
		];
		return rv;
	}

}
