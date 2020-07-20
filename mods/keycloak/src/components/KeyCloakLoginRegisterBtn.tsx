import { KVL, ldBlueprint, ILDOptions, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	 LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState,
	 initLDLocalState, generateItptFromCompInfo, gdsfpLD, VisualKeysDict, LDDict
	} from '@metaexplorer/core';
import { Component } from 'react';
import { KeyCloakAuthAPI, EVENT_KEYCLOAK_WEB_AUTH } from '../apis/KeyCloakAuthAPI';
import React from 'react';

export const KCAuthenticatorBtnName: string = "keycloak/auth/AuthenticatorButton";
export const loginRedir: string = "redirAfterLogin";
export const logoutRedir: string = "redirAfterLogout";

let allMyInputKeys: string[] = [loginRedir, logoutRedir];
let ownKVLs: KVL[] = [
	{
		key: loginRedir,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: logoutRedir,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const KCAuthenticatorCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: KCAuthenticatorBtnName,
	ownKVLs: ownKVLs,
	inKeys: allMyInputKeys,
	crudSkills: "cRUd"
};

export interface KCAuthenticatorBtnState extends LDLocalState {
	isKCAPIavailable: boolean;
	isAuthenticated: boolean;
}

@ldBlueprint(KCAuthenticatorCfg)
export class KCAuthenticatorBtn extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, KCAuthenticatorBtnState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: KCAuthenticatorBtnState): null | KCAuthenticatorBtnState {
		let rvLD = gdsfpLD(nextProps, prevState, [], allMyInputKeys);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return { ...prevState, ...rvNew };
	}

	kcAPI: KeyCloakAuthAPI;
	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];
	//generates child react components
	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], allMyInputKeys);

		if (KeyCloakAuthAPI.isInitialized()) {
			this.kcAPI = KeyCloakAuthAPI.getKeyCloakAuthAPISingleton();
			this.kcAPI.addEventListener(EVENT_KEYCLOAK_WEB_AUTH,
				(event) => {
					this.setState({ ...this.state, isAuthenticated: event.kcState.isAuthenticated });
				});
			this.state = { ...ldState, isAuthenticated: this.kcAPI.getState().isAuthenticated, isKCAPIavailable: true };
		} else {
			this.state = { ...ldState, isAuthenticated: false, isKCAPIavailable: false };
		}

	}
	render() {
		const { isAuthenticated, isKCAPIavailable, localValues } = this.state;
		let redirLogin: string = localValues.get(loginRedir);
		let redirLogout: string = localValues.get(logoutRedir);
		if (redirLogin && !redirLogin.startsWith("http")) {
			redirLogin = /*"http://" + window.location.host +*/ "/" + redirLogin;
		}
		if (redirLogout && !redirLogout.startsWith("http")) {
			redirLogout = "http://" + window.location.host + "/" + redirLogout;
		}
		if (!isKCAPIavailable) {
			return <div className="kc-signup"><b style={{ alignSelf: "center" }}>Keycloak adapter not initialised</b></div>;
		}
		return <div className="kc-signup">
			{
				isAuthenticated
					?
					<button className="signinoutbtn" onClick={() => {
						KeyCloakAuthAPI.getKC().logout({ redirectUri: redirLogout });
					}}>sign out</button>
					:
					<button className="signinoutbtn" onClick={() => {
						KeyCloakAuthAPI.getKC().login({ redirectUri: redirLogin });
					}}>sign in</button>
			}
		</div>;
	}
}
