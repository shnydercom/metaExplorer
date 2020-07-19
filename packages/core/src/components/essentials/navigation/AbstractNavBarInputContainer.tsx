import { IKvStore } from '../../../ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';
import { UserDefDict } from '../../../ldaccess/UserDefDict';
import { VisualKeysDict } from '../../visualcomposition/visualDict';
import { generateItptFromCompInfo, initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Component, ReactNode } from 'react';
import { LDDict } from '../../../ldaccess/LDDict';

export const NavBarInputContainerName = "metaexplorer.io/material-design/NavBarInputContainer";

let cfgIntrprtItptKeys: string[] =
	[
		VisualKeysDict.inputContainer,
		VisualKeysDict.primaryItpt
	];
let cfgIntrprtValueKeys: string[] = [
	VisualKeysDict.cssClassName
];
let cfgIntrprtKeys: string[] = [...cfgIntrprtItptKeys, ...cfgIntrprtValueKeys];
let ownKVL: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.primaryItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const NavBarInputContainerBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavBarInputContainerName,
	ownKVL: ownKVL,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarInputContainerState = {
};
export abstract class AbstractNavBarInputContainer extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarInputContainerState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavBarInputContainerState & LDLocalState)
		: null | NavBarInputContainerState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, cfgIntrprtItptKeys,
			cfgIntrprtValueKeys);
		if (!rvLD) {
			return null;
		}
		return {
			...prevState, ...rvLD
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVL: IKvStore[];

	protected renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let navBarStatePart: NavBarInputContainerState = {
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				cfgIntrprtItptKeys,
				cfgIntrprtValueKeys)
		};
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
