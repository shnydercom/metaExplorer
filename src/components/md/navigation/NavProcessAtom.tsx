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
import { Button } from 'react-toolbox/lib/button/';
import { generateItptFromCompInfo, initLDLocalState, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';

export const NavProcessAtomName = "shnyder/md/NavProcessAtom";
let cfgIntrprtKeys: string[] =
	[
		VisualDict.freeContainer,
		VisualDict.headerTxt,
		VisualDict.cancelTxt,
		VisualDict.confirmTxt,
		VisualDict.routeSend_cancel,
		VisualDict.routeSend_confirm
	];
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
		key: VisualDict.cancelTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.confirmTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.routeSend_cancel,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: VisualDict.routeSend_confirm,
		value: undefined,
		ldType: VisualDict.route_added,
	}
];
let bpCfg: BlueprintConfig = {
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
@ldBlueprint(bpCfg)
export class PureNavProcessAtom extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavProcessAtomState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | NavProcessAtomState & LDLocalState)
		: null | NavProcessAtomState & LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [
				VisualDict.headerTxt,
				VisualDict.cancelTxt,
				VisualDict.confirmTxt,
				VisualDict.routeSend_cancel,
				VisualDict.routeSend_confirm
			]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		return { ...prevState, ...rvLD, ...rvLocal };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

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
				[VisualDict.freeContainer],
				[
					VisualDict.headerTxt,
					VisualDict.cancelTxt,
					VisualDict.confirmTxt,
					VisualDict.routeSend_cancel,
					VisualDict.routeSend_confirm
				])
		};
	}

	/*componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}*/
	onCancelClick = () => {
		this.setState({
			...this.state,
			isDoRedirectCancel: true
		});
	}

	onConfirmClick = () => {
		this.setState({
			...this.state,
			isDoRedirectConfirm: true
		});
	}
	render() {
		const { ldOptions, routes } = this.props;
		const { isDoRedirectCancel, isDoRedirectConfirm, localValues } = this.state;
		const routeSendCancel = localValues.get(VisualDict.routeSend_cancel);
		const routeSendConfirm = localValues.get(VisualDict.routeSend_confirm);
		const headerText = localValues.get(VisualDict.headerTxt);
		const cancelTxt = localValues.get(VisualDict.cancelTxt);
		const confirmTxt = localValues.get(VisualDict.confirmTxt);
		if (isDoRedirectCancel && routeSendCancel) {
			return <Redirect to={routeSendCancel} />;
		}
		if (isDoRedirectConfirm && routeSendConfirm) {
			return <Redirect to={routeSendConfirm} />;
		}
		return <div className="bottom-nav">
			<AppBar
				title={headerText ? headerText : "cancel"}
				leftIcon="arrow_back"
				onLeftIconClick={() => this.onCancelClick()}
			/>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualDict.freeContainer)}
			</div>
			<div className="bottom-nav-tabs flex-container">
				<Button className="flex-filler"
					label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />
				<Button className="flex-filler"
					label={cancelTxt ? cancelTxt : "cancel"} onClick={() => this.onCancelClick()} />
			</div>
		</div>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavProcessAtom);
