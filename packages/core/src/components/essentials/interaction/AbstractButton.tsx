import React from "react";
import { LDDict } from "../../../ldaccess/LDDict";
import { KVL } from "../../../ldaccess/KVL";
import {
	BlueprintConfig,
	IBlueprintItpt,
	OutputKVMap,
} from "../../../ldaccess/ldBlueprint";
import { ILDOptions } from "../../../ldaccess/ildoptions";
import {
	LDConnectedState,
	LDConnectedDispatch,
	LDOwnProps,
	LDLocalState,
} from "../../../appstate/LDProps";
import { Redirect } from "react-router";
import { Component } from "react";
import {
	ActionKeysDict,
	ActionTypesDict,
	ActionType,
} from "../../../components/actions/ActionDict";
import {
	VisualKeysDict,
	VisualTypesDict,
} from "../../../components/visualcomposition/visualDict";
import {
	gdsfpLD,
	initLDLocalState,
} from "../../../components/generic/generatorFns";
import { cleanRouteString, isExternalRoute } from "../../../components/routing/route-helper-fns";
import { LDUIDict } from "../../../ldaccess";

export const fontIcon = "fontIcon";
export const isIcon = "isIcon";
let cfgIntrprtKeys: string[] = [
	VisualKeysDict.confirmTxt,
	VisualKeysDict.routeSend_confirm,
	ActionKeysDict.action_confirm,
	fontIcon,
	isIcon,
];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.confirmTxt,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: VisualKeysDict.routeSend_confirm,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: ActionKeysDict.action_confirm,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction,
	},
	{
		key: fontIcon,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: isIcon,
		value: undefined,
		ldType: LDDict.Boolean,
	},
];
export const ButtonBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: LDUIDict.Button,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud",
};
export type MDButtonState = {
	isDoRedirectConfirm: boolean;
};
export abstract class AbstractButton
	extends Component<
		LDConnectedState & LDConnectedDispatch & LDOwnProps,
		MDButtonState & LDLocalState
	>
	implements IBlueprintItpt {
	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | (MDButtonState & LDLocalState)
	): null | (MDButtonState & LDLocalState) {
		let rvLD = gdsfpLD(
			nextProps,
			prevState,
			[VisualKeysDict.inputContainer],
			[
				VisualKeysDict.confirmTxt,
				VisualKeysDict.routeSend_cancel,
				VisualKeysDict.routeSend_confirm,
				ActionKeysDict.action_confirm,
				fontIcon,
				isIcon,
			]
		);
		if (!rvLD) {
			return null;
		}
		return {
			...prevState,
			...rvLD,
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = this.constructor["cfg"] as BlueprintConfig;
		let navBarStatePart: MDButtonState = {
			isDoRedirectConfirm: false,
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(
				this.cfg,
				props,
				[],
				[
					VisualKeysDict.confirmTxt,
					VisualKeysDict.routeSend_cancel,
					VisualKeysDict.routeSend_confirm,
					ActionKeysDict.action_confirm,
					fontIcon,
					isIcon,
				]
			),
		};
	}

	onConfirmClick = () => {
		let confirmAction: ActionType = this.state.localValues.get(
			ActionKeysDict.action_confirm
		);
		if (confirmAction) {
			if (
				Array.isArray(confirmAction.payload) &&
				confirmAction.payload.length === 1
			) {
				confirmAction.payload = confirmAction.payload[0];
			}
			this.props.dispatchLdAction(
				confirmAction.ldId,
				confirmAction.ldType,
				confirmAction.payload
			);
		} else {
			this.setState({
				...this.state,
				isDoRedirectConfirm: true,
			});
		}
	};
	render() {
		const { isDoRedirectConfirm, localValues } = this.state;
		const routeSendConfirm = localValues.get(
			VisualKeysDict.routeSend_confirm
		);
		const confirmTxt = localValues.get(VisualKeysDict.confirmTxt);
		const iconUrlVal = localValues.get(fontIcon);
		let isIconVal = localValues.get(isIcon);
		isIconVal = !!isIconVal;
		const isExternal = isExternalRoute(routeSendConfirm);
		if (!isExternal && isDoRedirectConfirm && routeSendConfirm) {
			let route: string = cleanRouteString(
				routeSendConfirm,
				this.props.routes
			);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirectConfirm: false });
			return <Redirect to={route} />;
		}
		return this.renderButton(
			isIconVal,
			iconUrlVal,
			confirmTxt,
			isExternal && routeSendConfirm
		);
		/*if (isIconVal) {
			return <Button accent floating icon={iconUrlVal ? iconUrlVal : null} onClick={() => this.onConfirmClick()} ></Button>;
		}
		return <Button icon={iconUrlVal ? iconUrlVal : null} label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />;
		*/
	}

	protected renderButton(
		isIconVal: boolean,
		iconUrlVal: string,
		confirmTxt: string,
		routeAsHref?: string
	): JSX.Element {
		throw new Error("Method not implemented in abstract class");
	}
}
