import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { VisualDict } from '../../visualcomposition/visualDict';

import { Button } from 'react-toolbox/lib/button/';
import { initLDLocalState, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';

export const MDButtonName = "shnyder/md/Button";
let cfgIntrprtKeys: string[] =
	[
		VisualDict.confirmTxt,
		VisualDict.routeSend_confirm,
		VisualDict.action_confirm
	];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.confirmTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.routeSend_confirm,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: VisualDict.action_confirm,
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
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [
				VisualDict.confirmTxt,
				VisualDict.routeSend_confirm,
				VisualDict.action_confirm
			]);
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
					VisualDict.confirmTxt,
					VisualDict.routeSend_cancel,
					VisualDict.routeSend_confirm,
					VisualDict.action_confirm
				])
		};
	}

	onConfirmClick = () => {
		let confirmAction = this.state.localValues.get(VisualDict.action_confirm);
		//TODO: execute that action
		this.setState({
			...this.state,
			isDoRedirectConfirm: true
		});
	}
	render() {
		const { isDoRedirectConfirm, localValues } = this.state;
		const routeSendConfirm = localValues.get(VisualDict.routeSend_confirm);
		const confirmTxt = localValues.get(VisualDict.confirmTxt);
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
