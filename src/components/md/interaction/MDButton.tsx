import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import { Button } from 'react-toolbox/lib/button/';
import { initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { ActionKeysDict } from 'components/actions/ActionDict';

export const MDButtonName = "shnyder/md/Button";
let cfgIntrprtKeys: string[] =
	[
		VisualKeysDict.confirmTxt,
		VisualKeysDict.routeSend_confirm,
		ActionKeysDict.action_confirm
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
		ldType: LDDict.Action
	}
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
			nextProps, prevState, [VisualKeysDict.freeContainer],
			 [
				VisualKeysDict.confirmTxt,
				VisualKeysDict.routeSend_confirm,
				ActionKeysDict.action_confirm
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
					ActionKeysDict.action_confirm
				])
		};
	}

	onConfirmClick = () => {
		let confirmAction = this.state.localValues.get(ActionKeysDict.action_confirm);
		//TODO: execute that action
		this.setState({
			...this.state,
			isDoRedirectConfirm: true
		});
	}
	render() {
		const { isDoRedirectConfirm, localValues } = this.state;
		const routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		const confirmTxt = localValues.get(VisualKeysDict.confirmTxt);
		if (isDoRedirectConfirm && routeSendConfirm) {
			let route: string = cleanRouteString(routeSendConfirm, this.props.routes);
			//if (match.params.nextPath === undefined) match.params.nextPath = route;
			this.setState({ ...this.state, isDoRedirectConfirm: false });
			return <Redirect to={route} />;
		}
		return <Button raised label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureMDButton);
