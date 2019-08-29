import { IKvStore, BlueprintConfig, IBlueprintItpt, OutputKVMap, ldBlueprint, ILDOptions,
	LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState,
	initLDLocalState, generateItptFromCompInfo, gdsfpLD, VisualKeysDict } from '@metaexplorer/core';
import { Component } from 'react';
import { GoogleWebAuthAPI, gwaTestCfg, EVENT_GOOGLE_WEB_AUTH, GoogleWebAuthState } from '../apis/GoogleWebAuthAPI';
import React from 'react';

export const GoogleWebAuthenticatorName: string = "google-api/WebAuthenticator";
let allMyInputKeys: string[] = [];
let initialKVStores: IKvStore[] = [];
export const GWebAuthenticatorCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: GoogleWebAuthenticatorName,
	canInterpretType: "http://my-domain.com/my-class",
	initialKvStores: initialKVStores,
	interpretableKeys: allMyInputKeys,
	crudSkills: "cRUd"
};
export interface GWebAuthenticatorState extends LDLocalState {
	googleState: GoogleWebAuthState;
}

@ldBlueprint(GWebAuthenticatorCfg)
export class PureGWebAuthenticator extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, GWebAuthenticatorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: GWebAuthenticatorState): null | GWebAuthenticatorState {
		let rvLD = gdsfpLD(nextProps, prevState, [], []);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return { ...prevState, ...rvNew };
	}

	googleAPI: GoogleWebAuthAPI;
	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	//generates child react components
	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], []);

		this.googleAPI = GoogleWebAuthAPI.getSingleton();
		this.googleAPI.addEventListener(EVENT_GOOGLE_WEB_AUTH,
			(event) => {
				this.setState({ ...this.state, googleState: this.googleAPI.getState() });
				if (event.newState === "signedIn") {
					//let test = new GSheetsRetriever();
				}
			});
		this.state = { ...ldState, googleState: this.googleAPI.getState() };
	}
	render() {
		const { googleState } = this.state;
		const isLoggedIn: boolean = googleState.generalState === "signedIn";
		const isInitial: boolean = googleState.generalState === "initial";
		const canReSignIn: boolean = googleState.generalState === "notSignedIn";
		return <div>
			<h3>authenticate to google</h3>
			{
				canReSignIn ?
					<button onClick={() => {
						this.googleAPI.reSignIn();
					}}>sign in</button>
					: null
			}
			{isInitial ?
				<button onClick={() => {
					this.googleAPI.initClient(gwaTestCfg);
				}}>init google Web API</button>
				: null
			}
			{isLoggedIn ?
				<button onClick={() => {
					this.googleAPI.signOut();
				}}>sign out</button>
				: null
			}
		</div>;
	}
}
