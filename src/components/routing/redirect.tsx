import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { VisualDict } from "../visualcomposition/visualDict";
import { IKvStore } from "ldaccess/ikvstore";
import { Component } from "react";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from "appstate/LDProps";
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, initLDLocalState } from "../generic/generatorFns";
import { ILDOptions } from "ldaccess/ildoptions";
import { Redirect } from "react-router";
import { cleanRouteString } from "./route-helper-fns";

export const RouteRedirectName = "shnyder/routing/Redirect";
let cfgIntrprtKeys: string[] =
	[VisualDict.routeSend_confirm];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.routeSend_confirm,
		value: undefined,
		ldType: VisualDict.route_added,
	},
];
const bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: RouteRedirectName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface RedirectComponentState extends LDLocalState {

}
@ldBlueprint(bpCfg)
export class PureRedirectComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, RedirectComponentState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: RedirectComponentState): null | RedirectComponentState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [VisualDict.routeSend_confirm]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props,
			[],
			[VisualDict.routeSend_confirm]);
		this.state = {
			...ldState,
		};
	}
	render() {
		const { localValues } = this.state;
		let routeSendConfirm = localValues.get(VisualDict.routeSend_confirm);
		routeSendConfirm = cleanRouteString(routeSendConfirm, this.props.routes);
		console.log("Redir component redirect to: " + routeSendConfirm);
		return <Redirect to={routeSendConfirm} />;
	}
}
