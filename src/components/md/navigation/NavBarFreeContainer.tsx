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

export const NavBarFreeContainerName = "shnyder/md/NavBarFreeContainer";

let cfgIntrprtItptKeys: string[] =
	[
		VisualKeysDict.freeContainer,
		VisualKeysDict.primaryItpt
	];
let cfgIntrprtValueKeys: string[] = [
	VisualKeysDict.cssClassName
];
let cfgIntrprtKeys: string[] = [...cfgIntrprtItptKeys, ...cfgIntrprtValueKeys];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
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
	nameSelf: NavBarFreeContainerName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarFreeContainerState = {
};
@ldBlueprint(bpCfg)
export class PureNavBarFreeContainer extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarFreeContainerState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavBarFreeContainerState & LDLocalState)
		: null | NavBarFreeContainerState & LDLocalState {
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
		let navBarStatePart: NavBarFreeContainerState = {
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
				{this.renderSub(VisualKeysDict.freeContainer)}
			</div>
		</>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarFreeContainer);
