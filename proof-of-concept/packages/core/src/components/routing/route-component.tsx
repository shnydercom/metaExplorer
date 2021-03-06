import { LDDict } from '../../ldaccess/LDDict';
import { KVL } from '../../ldaccess/KVL';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';
import { UserDefDict } from '../../ldaccess/UserDefDict';
import { VisualKeysDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from '../generic/generatorFns';
import { Route } from 'react-router';
import { Component} from 'react';
import { ActionKeysDict, ActionTypesDict, ActionType } from '../../components/actions/ActionDict';
import React from 'react';

export const ROUTE_ISABSOLUTE = "isRouteAbsolute";
export const ROUTE_ISEXACT = "isRouteExact";
export const ROUTE_PATH = "routePath";

export const RouteComponentName = "metaexplorer.io/routing/Route";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH, ActionKeysDict.action_onRoute];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.inputContainer,
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
	},
	{
		key: ActionKeysDict.action_onRoute,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: RouteComponentName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface RouteComponentState extends LDLocalState {
	isExact: boolean;
	isAbsolute: boolean;
	toPath: string;
	actionPayload: any;
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
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], [ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH, ActionKeysDict.action_onRoute]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, };
		let isExact = !!rvNew.localValues.get(ROUTE_ISEXACT);
		let isAbsolute = !!rvNew.localValues.get(ROUTE_ISABSOLUTE);
		let toPath = rvNew.localValues.get(ROUTE_PATH);
		let actionOnRoute: ActionType = rvNew.localValues.get(ActionKeysDict.action_onRoute);
		if (actionOnRoute) {
			nextProps.dispatchLdAction(actionOnRoute.ldId, actionOnRoute.ldType, actionOnRoute.payload);
		}
		return {
			...rvNew,
			isExact,
			isAbsolute,
			toPath,
			actionPayload: actionOnRoute
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	private renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer],
			[ROUTE_ISEXACT, ROUTE_ISABSOLUTE, ROUTE_PATH]);
		let isExact = !!ldState.localValues.get(ROUTE_ISEXACT);
		let isAbsolute = !!ldState.localValues.get(ROUTE_ISABSOLUTE);
		let toPath = ldState.localValues.get(ROUTE_PATH);
		let actionPayload = ldState.localValues.get(ActionKeysDict.action_onRoute);
		this.state = {
			...ldState,
			isExact,
			isAbsolute,
			toPath,
			actionPayload
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
		return <Route exact={isExact} path={newPath} component={this.renderInputContainer} />;
	}
}
