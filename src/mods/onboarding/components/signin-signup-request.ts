import { LDRetrieverSuperRewrite } from "sidefx/LDRetrieverSuper-rewrite";
import { IKvStore } from "ldaccess/ikvstore";
import { itptKeysFromInputKvs } from "ldaccess/ldUtils";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { tokenStr } from "mods/keycloak/sidefx/KeyCloakAuthCfg";
import { LDDict } from "ldaccess/LDDict";

export const signinSignupName = "shnyder/meta-explorer/onboarding/signinSignupRequest";
let inputKVStores: IKvStore[] = [
	{
		key: "payload",
		value: undefined,
		ldType: undefined
	},
	{
		key: tokenStr,
		value: undefined,
		ldType: LDDict.Text
	},
];

let outputKVStores: IKvStore[] = [
	{
		key: "signinOrSignupText",
		value: undefined,
		ldType: LDDict.Text
	},
];

let initialKVStores = [...inputKVStores, ...outputKVStores];

let interpretableKeys = itptKeysFromInputKvs(inputKVStores);
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: signinSignupName,
	initialKvStores: initialKVStores,
	interpretableKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class SignInSignupRequest extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, interpretableKeys);
		this.apiCallOverride = () => new Promise((resolve, reject) => {
			const tokenValue = this.state.localValues.get(tokenStr);
			fetch('/api/login', {
				headers: new Headers(
					{
						Authorization: 'Bearer ' + tokenValue,
					}
				)
			}				//'/api/login'
			).then((response) => {
				if (response.status >= 400) {
					reject("Bad response from server");
				}
				response.json().then((bodyVal) => {
					resolve(bodyVal);
				}).catch((reason) => {
					reject(reason);
				});
			});
		});
	}
}
