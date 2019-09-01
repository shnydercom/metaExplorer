import { IKvStore } from '../../ldaccess/ikvstore';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';
import { UserDefDict } from '../../ldaccess/UserDefDict';
import { VisualKeysDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from '../generic/generatorFns';
import { Component } from 'react';
import React from 'react';

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];
export const createLayoutBpCfg: (nameSelf: string) => BlueprintConfig = (nameSelf: string) => {
	return {
		subItptOf: null,
		nameSelf: nameSelf,
		initialKvStores: initialKVStores,
		interpretableKeys: cfgIntrprtKeys,
		crudSkills: "cRud"
	};
};

export interface LayoutComponentState extends LDLocalState {
}

export abstract class PureLayoutComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LayoutComponentState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: LayoutComponentState): null | LayoutComponentState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], []);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string;

	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer],
			[]);
		this.state = {
			...ldState,
		};
	}
	render() {
		return <div className={this.styleClassName}>{this.renderInputContainer()}</div>;
	}
}

export const LayoutVHCenteredColumnName = 'metaexplorer.io/layout/vh-centered-column';
@ldBlueprint(createLayoutBpCfg(LayoutVHCenteredColumnName))
export class PureVHcenteredColumnLayout extends PureLayoutComponent {
	styleClassName = "vh-centered-column";
}
