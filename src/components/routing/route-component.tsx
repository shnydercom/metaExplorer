import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDRouteProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../visualcomposition/visualDict';

import { Tab } from 'react-toolbox/lib/tabs/';
import { Tabs } from 'react-toolbox/lib/tabs/';

import { generateIntrprtrForProp } from '../generic/generatorFns';
//import { active } from 'react-toolbox/lib/dropdown/theme.css';
import { checkAllFilled } from 'GeneralUtils';
import { Route } from 'react-router';

type ConnectedState = {
};

type ConnectedDispatch = {
};

export const ROUTE_ISEXACT = "isRouteExact";
export const ROUTE_PATH = "routePath";

export const RouteComponentName = "shnyder/Route";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, ROUTE_ISEXACT, ROUTE_PATH];
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
		key: ROUTE_PATH,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subInterpreterOf: null,
	nameSelf: RouteComponentName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export type RouteComponentState = {
	isExact: boolean;
	toPath: string;
	displayedComponent: any;
};

@ldBlueprint(bpCfg)
export class PureRouteComponent extends React.Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, RouteComponentState>
	implements IBlueprintInterpreter {
	state = {
		isExact: false,
		toPath: "",
		displayedComponent: null
	};
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		if (props) {
			this.handleKVs(props);
		}
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	render() {
		const { isExact, toPath, displayedComponent } = this.state;
		return <Route exact={ isExact} path={toPath} component={displayedComponent} />;
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		let displayedComponent: any = null;
		let isExact: boolean;
		let toPath: string;
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			displayedComponent = generateIntrprtrForProp(kvs, VisualDict.freeContainer);
		}
		isExact = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, ROUTE_ISEXACT));
		toPath = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, ROUTE_PATH));
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureRouteComponent);
