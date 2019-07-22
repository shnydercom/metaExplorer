import { LDRetrieverSuperRewrite } from "sidefx/LDRetrieverSuper-rewrite";
import { IKvStore } from "ldaccess/ikvstore";
import { itptKeysFromInputKvs } from "ldaccess/ldUtils";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { tokenStr } from "mods/keycloak/sidefx/KeyCloakAuthCfg";
import { LDDict } from "ldaccess/LDDict";
import { ILoginResponse, RESPONSE_CONTENT } from "../apis/datatypes";
import { OnboardingAPI } from "../apis/onboardingAPI";

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
		key: RESPONSE_CONTENT,
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
			OnboardingAPI.getOnboardingAPISingleton().loginFetch(resolve, reject, tokenValue);
		});
	}
}
