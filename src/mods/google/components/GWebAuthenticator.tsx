import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';

import { initLDLocalState, generateItptFromCompInfo, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { LDDict } from 'ldaccess/LDDict';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { GoogleWebAuthAPI, gwaTestCfg } from '../apis/GoogleWebAuthAPI';
import { Button } from 'react-toolbox/lib/button';

export const GoogleWebAuthenticatorName: string = "GoogleWebAuthenticator";
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
export interface GWebAuthenticatorState extends LDLocalState { }

@ldBlueprint(GWebAuthenticatorCfg)
export class PureGWebAuthenticator extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, GWebAuthenticatorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: GWebAuthenticatorState): null | GWebAuthenticatorState {
		let rvLD = getDerivedItptStateFromProps(nextProps, prevState, []); //gets the visual part
		let rvLocal = getDerivedKVStateFromProps(nextProps, prevState, []); //gets the non-visual
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return { ...rvNew };
	}

	googleAPI: GoogleWebAuthAPI;
	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	//generates child react components
	protected renderFreeContainer = generateItptFromCompInfo.bind(this, VisualDict.freeContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], []);
		this.state = { ...ldState, };
		this.googleAPI = GoogleWebAuthAPI.getSingleton();
	}
	render() {
		const { localValues } = this.state;
		const googleState = this.googleAPI.getState();
		console.log(googleState);
		const isLoggedIn: boolean = googleState.generalState === "signedIn";
		const isInitial: boolean = googleState.generalState === "initial";
		return <div>
			<h3>authenticate to google</h3>
			{isInitial ?
				<Button onClick={() => {
					this.googleAPI.initClient(gwaTestCfg);
				}}>init google Web API</Button>
				: null
			}
			{isLoggedIn ?
				<Button onClick={() => {
					this.googleAPI.signOut();
				}}>sign out</Button>
				: null
			}
		</div>;
	}
}
