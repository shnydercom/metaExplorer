import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import IconButton from 'react-toolbox/lib/button/';
import { IconMenu } from 'react-toolbox/lib/menu/';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateItptFromCompInfo, initLDLocalState, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';

export const NavBarWActionsName = "shnyder/md/NavBarWActions";

let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, VisualDict.headerTxt, VisualDict.routeSend_search, VisualDict.popOverContent, VisualDict.iconName];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.routeSend_search,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: VisualDict.popOverContent,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.iconName,
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
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.freeContainer, VisualDict.popOverContent]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [VisualDict.headerTxt, VisualDict.routeSend_search, VisualDict.iconName]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		return {
			...prevState, ...rvLD, ...rvLocal
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
				[VisualDict.freeContainer, VisualDict.popOverContent],
				[VisualDict.routeSend_search, VisualDict.headerTxt, VisualDict.iconName])
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
		const routeSendSearch = localValues.get(VisualDict.routeSend_search);
		const headerText = localValues.get(VisualDict.headerTxt);
		const iconName = localValues.get(VisualDict.iconName);
		const hasPopOverContent = compInfos.has(VisualDict.popOverContent);
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
							<div className="menu-pop-over">{this.renderSub(VisualDict.popOverContent)}</div>
						</IconMenu>
						: null}
				</Navigation>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualDict.freeContainer)}
			</div>
		</>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarWActions);
