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
import { classNamesLD } from 'components/reactUtils/compUtilFns';

export const NavBarWActionsName = "shnyder/material-design/NavBarWActions";

let cfgIntrprtItptKeys: string[] =
	[
		VisualKeysDict.inputContainer,
		VisualKeysDict.popOverContent
	];
let cfgIntrprtValueKeys: string[] = [
	VisualKeysDict.headerTxt,
	VisualKeysDict.routeSend_search,
	VisualKeysDict.iconName,
	VisualKeysDict.routeSend_cancel,
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
	{
		key: VisualKeysDict.routeSend_cancel,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	}
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
	isDoRedirectCancel: boolean;
	isRightMenuOpen: boolean;
};
@ldBlueprint(bpCfg)
export class NavBarWActions extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarWActionState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavBarWActionState & LDLocalState)
		: null | NavBarWActionState & LDLocalState {
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
		let navBarStatePart: NavBarWActionState = {
			isDoRedirect: false,
			isDoRedirectCancel: false,
			isRightMenuOpen: false,
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				cfgIntrprtItptKeys,
				cfgIntrprtValueKeys)
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

	onCancelClick = () => {
		this.setState({
			...this.state,
			isDoRedirectCancel: true,
			isRightMenuOpen: false
		});
	}

	render() {
		const { ldOptions, routes } = this.props;
		const { isDoRedirect, isDoRedirectCancel, isRightMenuOpen, localValues, compInfos } = this.state;
		const routeSendSearch = localValues.get(VisualKeysDict.routeSend_search);
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const iconName = localValues.get(VisualKeysDict.iconName);
		let routeSendCancel = localValues.get(VisualKeysDict.routeSend_cancel);
		const hasPopOverContent = compInfos.has(VisualKeysDict.popOverContent);
		if (isDoRedirectCancel && routeSendCancel) {
			routeSendCancel = cleanRouteString(routeSendCancel, this.props.routes);
			this.setState({ ...this.state, isDoRedirect: false, isDoRedirectCancel: false });
			return <Redirect to={routeSendCancel} />;
		}
		if (isDoRedirect && routeSendSearch) {
			let route: string = cleanRouteString(routeSendSearch, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirect: false, isDoRedirectCancel: false });
			console.log("navBar redirect to: " + route);
			return <Redirect to={route} />;
		}
		return <>
			<AppBar title={headerText ? headerText : "Menu"}
				leftIcon={routeSendCancel ? "arrow_back" : null}
				onLeftIconClick={() => this.onCancelClick()}
				className={classNamesLD(null, localValues)}
			>
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
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;
	}
}