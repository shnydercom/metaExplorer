import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { VisualKeysDict, VisualTypesDict } from "../visualcomposition/visualDict";
import { IKvStore } from "ldaccess/ikvstore";
import { Component } from "react";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from "appstate/LDProps";
import { gdsfpLD, initLDLocalState } from "../generic/generatorFns";
import { ILDOptions } from "ldaccess/ildoptions";
import { Redirect } from "react-router";
import { cleanRouteString } from "./route-helper-fns";
import React from "react";

export const RouteRedirectName = "shnyder/routing/Redirect";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.routeSend_confirm];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.routeSend_confirm,
		value: undefined,
		ldType: VisualTypesDict.route_added,
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
		let rvLD = gdsfpLD(
			nextProps, prevState, [], [VisualKeysDict.routeSend_confirm]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, };
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
			[VisualKeysDict.routeSend_confirm]);
		this.state = {
			...ldState,
		};
	}
	render() {
		const { localValues } = this.state;
		const { location } = this.props.routes;
		let routeSendConfirm = localValues.get(VisualKeysDict.routeSend_confirm);
		if (!routeSendConfirm) return null;
		routeSendConfirm = cleanRouteString(routeSendConfirm, this.props.routes);
		if (location.pathname === routeSendConfirm) return null;
		//handle routing for editor-switching:
		/*let routeQuery = this.props.routes.location.search;
		if (routeQuery && (routeQuery.indexOf('mode=editor') !== -1)
			&& routeSendConfirm && (routeSendConfirm.indexOf('mode=editor') === -1)) {
			routeSendConfirm += '?mode=editor';
			}*/
		return <Redirect to={routeSendConfirm} />;
	}
}
