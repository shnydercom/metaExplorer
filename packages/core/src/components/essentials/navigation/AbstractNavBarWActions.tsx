import React from 'react';
import { IKvStore } from '../../../ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';
import { initLDLocalState, gdsfpLD, generateItptFromCompInfo } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ReactNode } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { LDDict } from '../../../ldaccess/LDDict';
import { UserDefDict } from '../../../ldaccess/UserDefDict';

export const NavBarWActionsName = "metaexplorer.io/material-design/NavBarWActions";

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
export type NavBarWActionState = {
	isDoRedirect: boolean;
	isDoRedirectCancel: boolean;
	isRightMenuOpen: boolean;
};

let cfgIntrprtKeys: string[] = [...cfgIntrprtItptKeys, ...cfgIntrprtValueKeys];
let ownKVL: IKvStore[] = [
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

export const NavBarWActionsBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavBarWActionsName,
	ownKVL: ownKVL,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export abstract class AbstractNavBarWActions<TStateExtension = {}> extends
	Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarWActionState & LDLocalState & TStateExtension>
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
	ownKVL: IKvStore[];

	protected renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any, stateExtensionInit: TStateExtension) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let navBarStatePart: NavBarWActionState = {
			isDoRedirect: false,
			isDoRedirectCancel: false,
			isRightMenuOpen: false,
		};
		this.state = {
			...stateExtensionInit,
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				cfgIntrprtItptKeys,
				cfgIntrprtValueKeys)
		};
	}

	onAppBarRightIconMenuClick = () => {
		//will be called on opening and clicking inside the menu
	}
	onAppBarSearchBtnClick = () => {
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
		const { isDoRedirect, isDoRedirectCancel, localValues } = this.state;
		const routeSendSearch = localValues.get(VisualKeysDict.routeSend_search);
		let routeSendCancel = localValues.get(VisualKeysDict.routeSend_cancel);
		if (isDoRedirectCancel && routeSendCancel) {
			routeSendCancel = cleanRouteString(routeSendCancel, this.props.routes);
			this.setState({ ...this.state, isDoRedirect: false, isDoRedirectCancel: false });
			return <Redirect to={routeSendCancel} />;
		}
		if (isDoRedirect && routeSendSearch) {
			let route: string = cleanRouteString(routeSendSearch, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirect: false, isDoRedirectCancel: false });
			return <Redirect to={route} />;
		}
		return this.renderCore();
	}
	protected renderCore(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
