import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDDict } from "ldaccess/LDDict";
import { AbstractDataTransformer } from "datatransformation/abstractDataTransformer";
import { KeyCloakAuthAPI, EVENT_KEYCLOAK_WEB_AUTH } from "../apis/KeyCloakAuthAPI";
import { tokenStr } from "../sidefx/KeyCloakAuthCfg";
import { UserDefDict } from "ldaccess/UserDefDict";

export const keyCloakTokenStateName: string = "keycloak/auth/tokenstate";

export const KeyCloakTokenStateItptKeys: string[] = [];
export const KeyCloakTokenStateOutputKVs: IKvStore[] = [
	{
		key: tokenStr,
		value: undefined,
		ldType: LDDict.Text
	}
];

const initialKVStores: IKvStore[] = [
	...KeyCloakTokenStateOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: keyCloakTokenStateName,
	initialKvStores: initialKVStores,
	interpretableKeys: KeyCloakTokenStateItptKeys,
	crudSkills: "cRUd"
};

/**
 * class to retrieve a bearer token that can be used in an authorization-header
 */
@ldBlueprint(bpCfg)
export class KeyCloakTokenRetriever extends AbstractDataTransformer {
	//TODO: if there are more requirements for this class, check if AbstractDataTransformer is still the best suitable parent
	kcAPI: KeyCloakAuthAPI;

	constructor(ldTkStr: string) {
		super(ldTkStr);
		this.itptKeys = KeyCloakTokenStateItptKeys;
		this.outputKvStores = KeyCloakTokenStateOutputKVs;
		this.kcAPI = KeyCloakAuthAPI.getKeyCloakAuthAPISingleton();
		this.kcAPI.addEventListener(EVENT_KEYCLOAK_WEB_AUTH,
			(event) => {
				this.propagateChange();
			});
		this.propagateChange();
	}

	protected propagateChange() {
		let outputKVMap: IKvStore = this.cfg.initialKvStores.find((val) => UserDefDict.outputKVMapKey === val.key);
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
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];
		const tokenOutputKV = outputKvStores.get(tokenStr);
		tokenOutputKV.value = this.kcAPI.getState().token;
		rv = [
			tokenOutputKV
		];
		return rv;
	}
}
