import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDRouteProps, LDRouteParams } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../visualcomposition/visualDict';

import { Tab } from 'react-toolbox/lib/tabs/';
import { Tabs } from 'react-toolbox/lib/tabs/';

import { generateIntrprtrForProp } from '../generic/generatorFns';
// import { active } from 'react-toolbox/lib/dropdown/theme.css';
import { checkAllFilled } from 'GeneralUtils';
import { Route, withRouter, RouteComponentProps, RouteProps } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultItptRetriever';

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
		value: true,
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

export type RouteComponentState = {
	isExact: boolean;
	toPath: string;
	displayedComponent: React.ReactElement<LDConnectedState & LDConnectedDispatch & LDOwnProps>;
};
@ldBlueprint(bpCfg)
export class PureRouteComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, RouteComponentState>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			isExact: true,
			toPath: "",
			displayedComponent: null
		};
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	componentWillMount() {
		if (this.props.ldOptions) {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				this.handleKVs(this.props);
			}
		}
	}
	render() {
		const { isExact, toPath, displayedComponent } = this.state;
		console.log(this.state);
		const compExecFn = () => <>{displayedComponent}</>;
		return <Route exact={isExact} path={"/" + toPath} component={compExecFn} />;
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		let displayedComponent: any = null;
		let isExact: boolean;
		let toPath: string;
		const retriever = !props.ldOptions ? DEFAULT_ITPT_RETRIEVER_NAME : this.props.ldOptions.visualInfo.retriever;
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			displayedComponent = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
		if (!displayedComponent) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			displayedComponent = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
		isExact = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, ROUTE_ISEXACT));
		isExact = isExact === undefined ? true : isExact;
		toPath = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, ROUTE_PATH));
		this.setState({ displayedComponent, toPath, isExact });
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureRouteComponent);
