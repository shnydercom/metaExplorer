import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import { Button, IconButton } from 'react-toolbox/lib/button/';
import { initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { ActionKeysDict, ActionTypesDict, ActionType } from 'components/actions/ActionDict';
import { UserDefDict } from 'ldaccess/UserDefDict';

export const MDButtonName = "shnyder/material-design/Button";
const fontIcon = "fontIcon";
const isIcon = "isIcon";
let cfgIntrprtKeys: string[] =
	[
		VisualKeysDict.confirmTxt,
		VisualKeysDict.routeSend_confirm,
		ActionKeysDict.action_confirm,
		fontIcon,
		isIcon
	];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.confirmTxt,
		value: undefined,
		ldType: LDDict.Text
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
		key: fontIcon,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: isIcon,
		value: undefined,
		ldType: LDDict.Boolean
	},
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MDButtonName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type MDButtonState = {
	isDoRedirectConfirm: boolean;
};
@ldBlueprint(bpCfg)
export class PureMDButton extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, MDButtonState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | MDButtonState & LDLocalState)
		: null | MDButtonState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer],
			[
				VisualKeysDict.confirmTxt,
				VisualKeysDict.routeSend_cancel,
				VisualKeysDict.routeSend_confirm,
				ActionKeysDict.action_confirm,
				fontIcon,
				isIcon
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
		let navBarStatePart: MDButtonState = {
			isDoRedirectCancel: false,
			isDoRedirectConfirm: false
		};
		this.state = {
			...navBarStatePart,
			...initLDLocalState(this.cfg, props,
				[],
				[
					VisualKeysDict.confirmTxt,
					VisualKeysDict.routeSend_cancel,
					VisualKeysDict.routeSend_confirm,
					ActionKeysDict.action_confirm,
					fontIcon,
					isIcon
				])
		};
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
	render() {
		const { isDoRedirectConfirm, localValues } = this.state;
		const routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		const confirmTxt = localValues.get(VisualKeysDict.confirmTxt);
		const iconUrlVal = localValues.get(fontIcon);
		let isIconVal = localValues.get(isIcon);
		isIconVal = !!isIconVal;
		if (isDoRedirectConfirm && routeSendConfirm) {
			let route: string = cleanRouteString(routeSendConfirm, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirectConfirm: false });
			return <Redirect to={route} />;
		}
		if (isIconVal) {
			return <Button accent floating icon={iconUrlVal ? iconUrlVal : null} onClick={() => this.onConfirmClick()} ></Button>;
		}
		return <Button icon={iconUrlVal ? iconUrlVal : null} label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureMDButton);
