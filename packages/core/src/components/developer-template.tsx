import React from 'react';
import { KVL } from '../ldaccess/KVL';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../ldaccess/ldBlueprint';
import { ILDOptions } from '../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../appstate/LDProps';
import { UserDefDict } from '../ldaccess/UserDefDict';
import { VisualKeysDict } from './visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from './generic/generatorFns';
import { Component } from 'react';
import { LDDict } from '../ldaccess/LDDict';

let allMyInputKeys: string[] = [VisualKeysDict.inputContainer, "http://my-domain.com/my-class/my-member-a"];
let ownKVLs: KVL[] = [ //the content of the key-value stores at initialization
	//is an input, because it is defined in var allMyInputKeys, and is a visual container
	{ key: VisualKeysDict.inputContainer, value: undefined, ldType: UserDefDict.intrprtrClassType },
	//is an input, because it is defined in var allMyInputKeys, is NOT a visual container
	{ key: "http://my-domain.com/my-class/my-member-a", value: undefined, ldType: LDDict.Text },
	//is an output, because it is NOT defined in var allMyInputKey
	{ key: "http://my-domain.com/my-class/my-member-b", value: undefined, ldType: LDDict.Text }
];
export const myTemplateCfg: BlueprintConfig = {
	subItptOf: null, //used for extending compound nodes
	nameSelf: "http://my-domain.com/components/my-component-name",
	canInterpretType: "http://my-domain.com/my-class",
	ownKVLs: ownKVLs,
	inKeys: allMyInputKeys,
	crudSkills: "cRUd" //supports _R_ead and _U_pdate, but not _c_reate and _d_elete (capitalization)
};
export interface MyTemplateState extends LDLocalState { }

@ldBlueprint(myTemplateCfg)
export class PureMyTemplate extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, MyTemplateState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: MyTemplateState): null | MyTemplateState {
		let rvLD = gdsfpLD(nextProps, prevState,
			[VisualKeysDict.inputContainer], //gets the visual part
			["http://my-domain.com/my-class/my-member-a"], //gets the non-visual
			"http://my-domain.com/my-class" // is the canInterpretType field
			);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return { ...rvNew };
	}

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
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer], ["http://my-domain.com/my-class/my-member-a"]);
		this.state = { ...ldState, };
	}
	outputMemberB = () => {
		const modifiedKV: KVL = { key: "http://my-domain.com/my-class/my-member-b", value: "some Text", ldType: LDDict.Text };
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey); //internally set up for you
		this.props.dispatchKvOutput([modifiedKV], this.props.ldTokenString, outputKVMap); //outputting to the state machine
	}
	render() {
		const { localValues } = this.state;
		const myMemberA = localValues.get("http://my-domain.com/my-class/my-member-a");
		return <>
			<div onClick={() => this.outputMemberB()}>{myMemberA}</div>
			<div>{this.renderInputContainer()}</div>
		</>;
	}
}
