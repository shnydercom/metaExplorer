import { connect } from 'react-redux';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateItptFromCompInfo, initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { classNamesLD } from 'components/reactUtils/compUtilFns';
import { LDDict } from 'ldaccess/LDDict';

export const NavBarInputContainerName = "shnyder/md/NavBarInputContainer";

let cfgIntrprtItptKeys: string[] =
	[
		VisualKeysDict.inputContainer,
		VisualKeysDict.primaryItpt
	];
let cfgIntrprtValueKeys: string[] = [
	VisualKeysDict.cssClassName
];
let cfgIntrprtKeys: string[] = [...cfgIntrprtItptKeys, ...cfgIntrprtValueKeys];
let initialKVStores: IKvStore[] = [
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
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavBarInputContainerName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarInputContainerState = {
};
@ldBlueprint(bpCfg)
export class PureNavBarInputContainer extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarInputContainerState & LDLocalState>
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
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

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

	render() {
		const {  compInfos, localValues } = this.state;
		const hasPrimaryContent = compInfos.has(VisualKeysDict.primaryItpt);
		return <>
			<AppBar className={classNamesLD("full-navbar", localValues)}>
				<Navigation type='horizontal'>
					{hasPrimaryContent
						? <>{this.renderSub(VisualKeysDict.primaryItpt)}</>
						: null}
				</Navigation>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarInputContainer);
