import { ILDOptions } from "ldaccess/ildoptions";
import { IKvStore } from "ldaccess/ikvstore";
import { LDDict } from "ldaccess/LDDict";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { KeyCloakAuthAPI, EVENT_KEYCLOAK_WEB_AUTH } from "../apis/KeyCloakAuthAPI";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { LDRetrieverSuperRewrite } from "sidefx/LDRetrieverSuper-rewrite";
import { initLDLocalState } from "components/generic/generatorFns";

export const kcloakAuthCfgName = "keycloak/auth/config";
export const jsonCfgPath = "jsonConfigurationPath";
export const isAuthenticated = "isAuthenticated";
export const tokenStr = "bearertoken";
export const kcCfgItptKeys = [jsonCfgPath];
let initialKVStores: IKvStore[] = [
	{
		key: jsonCfgPath,
		value: undefined,
		ldType: LDDict.Text
	},
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
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: kcloakAuthCfgName,
	initialKvStores: initialKVStores,
	interpretableKeys: kcCfgItptKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class KeyCloakAuthCfg extends LDRetrieverSuperRewrite {
	kcAuthApi: KeyCloakAuthAPI;

	constructor() {
		super();
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, null, [], [...kcCfgItptKeys, UserDefDict.outputKVMapKey]);
		let okvMap = ldState.localValues.get(UserDefDict.outputKVMapKey);
		if (okvMap) {
			this.outputKVMap = okvMap;
		}
		this.state = {
			isInputDirty: false,
			isOutputDirty: false,
			webContent: null,
			retrieverStoreKey: null,
			interpretableKeys: kcCfgItptKeys,
			...ldState
		};
		this.initKCApi();
		this.kcAuthApi.addEventListener(EVENT_KEYCLOAK_WEB_AUTH,
			(event) => {
				this.propagateChange();
			});
		this.propagateChange();
	}

	initKCApi = () => {
		if (!this.kcAuthApi) {
			if (!this.state) return;
			let jsonCfgString = this.state.localValues.get(jsonCfgPath);
			if (!!jsonCfgString) {
				this.kcAuthApi = KeyCloakAuthAPI.getKeyCloakAuthAPISingleton(jsonCfgString);
			}
		}
	}

	consumeLDOptions(ldOptions: ILDOptions) {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		//added this line and sub-interpreterkeys:
		this.initKCApi();
		const gdsfpResult = this.consumeLDOptionsLikeGDSFP(ldOptions);
		if (gdsfpResult) {
			for (let idx = 0; idx < kcCfgItptKeys.length; idx++) {
				const inputKey = kcCfgItptKeys[idx];
				let param = gdsfpResult.localValues.get(inputKey);
				if (!param) break;
				let prevParam = this.state.localValues.get(inputKey);
				if (param !== prevParam) {
					gdsfpResult.isInputDirty = true;
					break;
				}
			}
			let okvMap = gdsfpResult.localValues.get(UserDefDict.outputKVMapKey);
			if (okvMap) {
				this.outputKVMap = okvMap;
			}
			this.setState(gdsfpResult);
			this.setWebContent(ldOptions);
			this.evalDirtyInput();
			this.evalDirtyOutput();
		}
	}

	callToAPI(uploadData?: ILDOptions, targetUrl?: string, targetReceiverLnk?): void {
		this.updateAPIcallOverride();
		if (this.apiCallOverride !== null) {
			super.callToAPI(uploadData, targetUrl, targetReceiverLnk);
		}
	}

	updateAPIcallOverride = () => {
		if (this.kcAuthApi) {
			/*let jsonCfgKv = this.inputParams.get(jsonCfgPath);
			let rangeKv: IKvStore = this.state.localValues.get(isAuthenticated);
			let jsonCfgString = jsonCfgKv.value; //'1HL-Zf9NKxuo03SVlcMGQk22I5ZhGq3CD4nX9k12TBLA';
			let subSheet: string = subSheetKv.value; //'History';
			let range: string = rangeKv.value; // 'A1:I';
			this.apiCallOverride = () => new Promise((resolve, reject) => {
				this.kcAuthApi.values.get({
					spreadsheetId: spreadsheetId, // example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
					range: subSheet + '!' + range,
				}).then((response) => {
					resolve({ [token]: response.result.values });
				}, (response) => {
					reject('Error: ' + response.result.error.message);
				});
			});*/
		}
	}

	protected propagateChange() {
		this.setState({...this.state, isOutputDirty: true});
		this.evalDirtyOutput();
	}
}
