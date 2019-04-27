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
import { Button } from 'react-toolbox/lib/button/';
import { generateItptFromCompInfo, initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { ActionKeysDict } from 'components/actions/ActionDict';
import { classNamesLD } from 'components/reactUtils/compUtilFns';

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
		ldType: UserDefDict.metaExplorerAction
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
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
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], [
				VisualKeysDict.headerTxt,
				VisualKeysDict.cancelTxt,
				VisualKeysDict.confirmTxt,
				VisualKeysDict.routeSend_cancel,
				VisualKeysDict.routeSend_confirm
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
				[VisualKeysDict.inputContainer],
				[
					VisualKeysDict.headerTxt,
					VisualKeysDict.cancelTxt,
					VisualKeysDict.confirmTxt,
					VisualKeysDict.routeSend_cancel,
					VisualKeysDict.routeSend_confirm
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
		this.setState({
			...this.state,
			isDoRedirectConfirm: true
		});
	}
	render() {
		const { isDoRedirectCancel, isDoRedirectConfirm, localValues } = this.state;
		let routeSendCancel: string = localValues.get(VisualKeysDict.routeSend_cancel);
		let routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const cancelTxt = localValues.get(VisualKeysDict.cancelTxt);
		const confirmTxt = localValues.get(VisualKeysDict.confirmTxt);
		//don't display bottom content if no routes or button text values are defined
		const isHideBottom: boolean = !routeSendConfirm
			&& !cancelTxt && !confirmTxt;
		if (isDoRedirectCancel && routeSendCancel) {
			routeSendCancel = cleanRouteString(routeSendCancel, this.props.routes);
			return <Redirect to={routeSendCancel} />;
		}
		if (isDoRedirectConfirm && routeSendConfirm) {
			routeSendConfirm = cleanRouteString(routeSendConfirm, this.props.routes);
			return <Redirect to={routeSendConfirm} />;
		}
		return <div className="bottom-nav">
			<AppBar
				title={headerText ? headerText : "cancel"}
				leftIcon="arrow_back"
				onLeftIconClick={() => this.onCancelClick()}
				className={classNamesLD(null, localValues)}
			/>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
			{isHideBottom ? null :
				<div className="bottom-nav-tabs flex-container">
					<Button className="flex-filler"
						label={cancelTxt ? cancelTxt : "cancel"} onClick={() => this.onCancelClick()} />
					<Button className="flex-filler"
						label={confirmTxt ? confirmTxt : "confirm"} onClick={() => this.onConfirmClick()} />
				</div>
			}
		</div>;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavProcessAtom);
