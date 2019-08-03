import React from 'react';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';
import { initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ReactNode } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { ActionKeysDict, ActionTypesDict, ActionType } from 'components/actions/ActionDict';

export const NavProcessAtomName = "shnyder/material-design/NavProcessAtom";
let cfgIntrprtKeys: string[] =
	[
		VisualKeysDict.inputContainer,
		VisualKeysDict.headerTxt,
		VisualKeysDict.cancelTxt,
		VisualKeysDict.confirmTxt,
		VisualKeysDict.routeSend_cancel,
		VisualKeysDict.routeSend_confirm,
		ActionKeysDict.action_confirm,
		VisualKeysDict.cssClassName
	];
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
		key: VisualKeysDict.cancelTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.confirmTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.routeSend_cancel,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: VisualKeysDict.routeSend_confirm,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: ActionKeysDict.action_confirm,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const NavProcessAtomBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavProcessAtomName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavProcessAtomState = {
	isDoRedirectConfirm: boolean;
	isDoRedirectCancel: boolean;
};

export abstract class AbstractNavProcessAtom extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavProcessAtomState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavProcessAtomState & LDLocalState)
		: null | NavProcessAtomState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], [
				VisualKeysDict.headerTxt,
				VisualKeysDict.cancelTxt,
				VisualKeysDict.confirmTxt,
				VisualKeysDict.routeSend_cancel,
				VisualKeysDict.routeSend_confirm,
				ActionKeysDict.action_confirm,
				VisualKeysDict.cssClassName
			]);
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

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let navBarStatePart: NavProcessAtomState = {
			isDoRedirectCancel: false,
			isDoRedirectConfirm: false
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				[VisualKeysDict.inputContainer],
				[
					VisualKeysDict.headerTxt,
					VisualKeysDict.cancelTxt,
					VisualKeysDict.confirmTxt,
					VisualKeysDict.routeSend_cancel,
					VisualKeysDict.routeSend_confirm,
					ActionKeysDict.action_confirm,
					VisualKeysDict.cssClassName
				])
		};
	}

	onCancelClick = () => {
		this.setState({
			...this.state,
			isDoRedirectCancel: true
		});
	}

	onConfirmClick = () => {
		let confirmAction: ActionType = this.state.localValues.get(ActionKeysDict.action_confirm);
		if (confirmAction) {
			this.props.dispatchLdAction(confirmAction.ldId, confirmAction.ldType, confirmAction.payload);
		}
		this.setState({
			...this.state,
			isDoRedirectConfirm: true
		});
	}

	render(): ReactNode {
		const { isDoRedirectCancel, isDoRedirectConfirm, localValues } = this.state;
		let routeSendCancel: string = localValues.get(VisualKeysDict.routeSend_cancel);
		let routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		const cancelTxt = localValues.get(VisualKeysDict.cancelTxt);
		const confirmTxt = localValues.get(VisualKeysDict.confirmTxt);
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		if (isDoRedirectCancel && routeSendCancel) {
			routeSendCancel = cleanRouteString(routeSendCancel, this.props.routes);
			return <Redirect to={routeSendCancel} />;
		}
		if (isDoRedirectConfirm && routeSendConfirm) {
			routeSendConfirm = cleanRouteString(routeSendConfirm, this.props.routes);
			return <Redirect to={routeSendConfirm} />;
		}
		const isHideBottom: boolean = !routeSendConfirm
			&& !cancelTxt && !confirmTxt;
		return this.renderCore(headerText, cancelTxt, confirmTxt, isHideBottom);
	}

	protected renderCore(headerText: string, cancelTxt: string, confirmTxt: string, isHideBottom: boolean): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
