import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../generic/generatorFns';
import { Route } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';

export const ROUTE_ISABSOLUTE = "isRouteAbsolute";
export const ROUTE_ISEXACT = "isRouteExact";
export const ROUTE_PATH = "routePath";

export const RouteComponentName = "shnyder/Route";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: ROUTE_ISEXACT,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: ROUTE_ISABSOLUTE,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: ROUTE_PATH,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: RouteComponentName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface RouteComponentState extends LDLocalState {
	isExact: boolean;
	isAbsolute: boolean;
	toPath: string;
}

/**
 * if isRouteExact is true, will match on the exact path as in "without sub-paths"
 */
@ldBlueprint(bpCfg)
export class PureRouteComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, RouteComponentState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: RouteComponentState): null | RouteComponentState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		let isExact = !!rvNew.localValues.get(ROUTE_ISEXACT);
		let isAbsolute = !!rvNew.localValues.get(ROUTE_ISABSOLUTE);
		let toPath = rvNew.localValues.get(ROUTE_PATH);
		return {
			...rvNew,
			isExact,
			isAbsolute,
			toPath
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderFreeContainer = generateItptFromCompInfo.bind(this, VisualDict.freeContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualDict.freeContainer],
			[ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH]);
		let isExact = !!ldState.localValues.get(ROUTE_ISEXACT);
		let isAbsolute = !!ldState.localValues.get(ROUTE_ISABSOLUTE);
		let toPath = ldState.localValues.get(ROUTE_PATH);
		this.state = {
			...ldState,
			isExact,
			isAbsolute,
			toPath
		};
	}

	render() {
		const { isExact, toPath, isAbsolute } = this.state;
		const { routes } = this.props;
		let newPath = !isAbsolute && routes && routes.match ? routes.match.path : "";
		if (!newPath.startsWith("/")) {
			newPath += "/" + toPath;
		} else {
			newPath += toPath;
		}
		return <Route exact={isExact} path={newPath} component={this.renderFreeContainer} />;
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureRouteComponent);
