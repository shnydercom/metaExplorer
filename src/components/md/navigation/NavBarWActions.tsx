import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import IconButton from 'react-toolbox/lib/button/';
import { IconMenu } from 'react-toolbox/lib/menu/';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateItptFromCompInfo, initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';

export const NavBarWActionsName = "shnyder/md/NavBarWActions";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.freeContainer, VisualKeysDict.headerTxt, VisualKeysDict.routeSend_search, VisualKeysDict.popOverContent, VisualKeysDict.iconName];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.routeSend_search,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: VisualKeysDict.popOverContent,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.iconName,
		value: undefined,
		ldType: LDDict.Text
	},

];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavBarWActionsName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarWActionState = {
	isDoRedirect: boolean;
	isRightMenuOpen: boolean;
};
@ldBlueprint(bpCfg)
export class PureNavBarWActions extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarWActionState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavBarWActionState & LDLocalState)
		: null | NavBarWActionState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.freeContainer, VisualKeysDict.popOverContent],
			[VisualKeysDict.headerTxt, VisualKeysDict.routeSend_search, VisualKeysDict.iconName]);
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
		let navBarStatePart: NavBarWActionState = {
			isDoRedirect: false,
			isRightMenuOpen: false,
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				[VisualKeysDict.freeContainer, VisualKeysDict.popOverContent],
				[VisualKeysDict.routeSend_search, VisualKeysDict.headerTxt, VisualKeysDict.iconName])
		};
	}

	onAppBarRightIconMenuClick = (e) => {
		//will be called on opening and clicking inside the menu
	}
	onAppBarSearchBtnClick = (e) => {
		this.setState({
			...this.state,
			isDoRedirect: true,
			isRightMenuOpen: false
		});
	}
	render() {
		const { ldOptions, routes } = this.props;
		const { isDoRedirect, isRightMenuOpen, localValues, compInfos } = this.state;
		const routeSendSearch = localValues.get(VisualKeysDict.routeSend_search);
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const iconName = localValues.get(VisualKeysDict.iconName);
		const hasPopOverContent = compInfos.has(VisualKeysDict.popOverContent);
		if (isDoRedirect && routeSendSearch) {
			let route: string = cleanRouteString(routeSendSearch, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirect: false });
			console.log("navBar redirect to: " + route);
			return <Redirect to={route} />;
		}
		return <>
			<AppBar title={headerText ? headerText : "Menu"}>
				<Navigation type='horizontal'>
					{routeSendSearch
						? <IconButton icon='search' onClick={this.onAppBarSearchBtnClick} />
						: null}
					{hasPopOverContent
						? <IconMenu icon={iconName ? iconName : 'account_circle'} position='topRight' menuRipple onClick={this.onAppBarRightIconMenuClick}>
							<div className="menu-pop-over">{this.renderSub(VisualKeysDict.popOverContent)}</div>
						</IconMenu>
						: null}
				</Navigation>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.freeContainer)}
			</div>
		</>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarWActions);
