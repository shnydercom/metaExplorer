import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDRouteProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../../visualcomposition/visualDict';

import { Tab } from 'react-toolbox/lib/tabs/';
import { Tabs } from 'react-toolbox/lib/tabs/';

import { generateIntrprtrForProp } from '../../generic/generatorFns';
//import { active } from 'react-toolbox/lib/dropdown/theme.css';
import { checkAllFilled } from 'GeneralUtils';
import { Redirect, Route } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { NetworkPreferredToken } from 'ldaccess/ildtoken';

type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/

export const TAB_1_ICONURL = "IconURL_1";
export const TAB_1_ICONURL_DISABLED = "IconURL_1_Disabled";
export const TAB_1_ROUTESEND = "RouteSend_1";
export const TAB_2_ICONURL = "IconURL_2";
export const TAB_2_ICONURL_DISABLED = "IconURL_2_Disabled";
export const TAB_2_ROUTESEND = "RouteSend_2";
export const TAB_3_ICONURL = "IconURL_3";
export const TAB_3_ICONURL_DISABLED = "IconURL_3_Disabled";
export const TAB_3_ROUTESEND = "RouteSend_3";
export const TAB_4_ICONURL = "IconURL_4";
export const TAB_4_ICONURL_DISABLED = "IconURL_4_Disabled";
export const TAB_4_ROUTESEND = "RouteSend_4";
export const TAB_5_ICONURL = "IconURL_5";
export const TAB_5_ICONURL_DISABLED = "IconURL_5_Disabled";
export const TAB_5_ROUTESEND = "RouteSend_5";

export const CHANGED_ROUTE_OUTPUT = "ChangedRoute";

export const BottomNavigationName = "shnyder/md/BottomNavigation";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, TAB_1_ICONURL, TAB_1_ICONURL_DISABLED, TAB_1_ROUTESEND, TAB_2_ICONURL,
		TAB_2_ICONURL_DISABLED, TAB_2_ROUTESEND, TAB_3_ICONURL, TAB_3_ICONURL_DISABLED, TAB_3_ROUTESEND,
		TAB_4_ICONURL, TAB_4_ICONURL_DISABLED, TAB_4_ROUTESEND,
		TAB_5_ICONURL, TAB_5_ICONURL_DISABLED, TAB_5_ROUTESEND];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: TAB_1_ICONURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_1_ICONURL_DISABLED,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_1_ROUTESEND,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: TAB_2_ICONURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_2_ICONURL_DISABLED,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_2_ROUTESEND,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: TAB_3_ICONURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_3_ICONURL_DISABLED,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_3_ROUTESEND,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: TAB_4_ICONURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_4_ICONURL_DISABLED,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_4_ROUTESEND,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: TAB_5_ICONURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_5_ICONURL_DISABLED,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: TAB_5_ROUTESEND,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: CHANGED_ROUTE_OUTPUT,
		value: undefined,
		ldType: VisualDict.route_added
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: BottomNavigationName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export type BottomNavState = {
	tabIdx: number;
};

@ldBlueprint(bpCfg)
export class PureBottomNavigation extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, BottomNavState>
	implements IBlueprintItpt {
	state = {
		tabIdx: 0
	};
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	topFreeContainer: React.Component<LDOwnProps> = null;
	tabIdx: number = 0;
	icon1url: string = null;
	icon2url: string = null;
	icon3url: string = null;
	icon4url: string = null;
	icon5url: string = null;
	icon1urlDisabled: string = null;
	icon2urlDisabled: string = null;
	icon3urlDisabled: string = null;
	icon4urlDisabled: string = null;
	icon5urlDisabled: string = null;
	route1: string = null;
	route2: string = null;
	route3: string = null;
	route4: string = null;
	route5: string = null;
	isGen1: boolean = false;
	isGen2: boolean = false;
	isGen3: boolean = false;
	isGen4: boolean = false;
	isGen5: boolean = false;

	private hasTabChanged: boolean = true;
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
	}
	componentWillMount() {
		if (this.props.ldOptions) {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				let props = this.props;
				this.handleKVs(props);
				this.handleRoutes(props.routes);
				this.hasTabChanged = true;
			}
		}
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
			this.handleRoutes(nextProps.routes);
		}
	}
	onTabChanged = (tabIdx) => {
		if (this.state.tabIdx !== tabIdx) this.hasTabChanged = true;
		this.setState({ tabIdx });
		const outRouteKV: IKvStore = {
			key: CHANGED_ROUTE_OUTPUT,
			value: undefined,
			ldType: VisualDict.route_added
		};
		let ldOptions: ILDOptions = {
			isLoading: false,
			lang: "en",
			ldToken: new NetworkPreferredToken("someToken"),
			resource: null,
			visualInfo: { retriever: "default" }
		};
		this.props.notifyLDOptionsChange(ldOptions);
		//this.props.dispatchKvOutput([outRouteKV], this.props.ldTokenString, this.outputKVMap);
		//this.tabIdx = idx; //TODO: change to state-handling
	}
	generateTab(imgSrcActive, imgSrcInActive: string, route: string, isActive: boolean): JSX.Element {
		//const mustRedirect = match && isActive && (match.params.lastPath !== undefined || match.params.lastPath !== null) && match.params.lastPath !== route;
		return <Tab label='' className="bottom-nav-tab" icon={isActive
			? <img src={imgSrcActive} height="30px" />
			: <img src={imgSrcInActive} height="30px" />}>
		</Tab>;
	}
	generateRedirect(tabIdx: number): JSX.Element {
		if (!this.props.routes || !this.hasTabChanged) return null;
		const { match, location } = this.props.routes;
		let route: string = "";
		if (match.params.nextPath === undefined) match.params.nextPath = route;
		switch (tabIdx) {
			case 0:
				route = this.route1;
				break;
			case 1:
				route = this.route2;
				break;
			case 2:
				route = this.route3;
				break;
			case 3:
				route = this.route4;
				break;
			case 4:
				route = this.route5;
				break;
			default:
				break;
		}
		let newPath: string = match.url.endsWith("/") ? match.url + route : `${match.url}/${route}`;
		this.hasTabChanged = false;
		this.generateRoutableTopFree(this.props, route);
		//if (location.pathname === newPath) return null;
		return <Redirect to={newPath} />;
	}

	generateRoutableTopFree(props: LDOwnProps & LDConnectedState, nextPath: string) {
		let kvs: IKvStore[];
		const retriever = this.props.ldOptions.visualInfo.retriever;
		const newRoutes = { ... this.props.routes };
		if (nextPath) {
			newRoutes.match.params.nextPath = nextPath;
		}
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.topFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
		if (!this.topFreeContainer) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.topFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
	}
	render() {
		const { ldOptions } = this.props;
		let tabIdx = this.state.tabIdx;
		if (this.topFreeContainer && this.topFreeContainer.props.routes) {
			/*console.log("topfree routes: ");
			console.dir(this.topFreeContainer.props.routes);
			console.log("this routes:");
			console.dir(this.props.routes);*/
		}
		const bsCompExecFn = () => <>{this.topFreeContainer}</>;
		return <div className="bottom-nav">
			<div className="bottom-nav-topfree mdscrollbar">
				<Route component={bsCompExecFn} />
				{this.props.children}
				{this.generateRedirect(tabIdx)}
			</div>
			<Tabs index={tabIdx} onChange={this.onTabChanged} fixed className="bottom-nav-tabs">
				{this.isGen1 ? this.generateTab(this.icon1url, this.icon1urlDisabled, this.route1, tabIdx === 0) : null}
				{this.isGen2 ? this.generateTab(this.icon2url, this.icon2urlDisabled, this.route2, tabIdx === 1) : null}
				{this.isGen3 ? this.generateTab(this.icon3url, this.icon3urlDisabled, this.route3, tabIdx === 2) : null}
				{this.isGen4 ? this.generateTab(this.icon4url, this.icon4urlDisabled, this.route4, tabIdx === 3) : null}
				{this.isGen5 ? this.generateTab(this.icon5url, this.icon5urlDisabled, this.route5, tabIdx === 4) : null}
			</Tabs>
		</div>;
	}

	private handleRoutes(routes: LDRouteProps) {
		if (!routes) return;
		const { match } = routes;
		let tabIdx = 0;
		if (!match) {
			console.error("BottomNavigation: No route information passed to BottomNavigation, can't switch tabs");
			return;
		}
		if (!match.params) match.params = { nextPath: null };
		if (match.params.nextPath) {
			let tabIdxCounter = 0;
			const lastPath = match.params.nextPath;
			if (lastPath === this.route1) tabIdx = tabIdxCounter;
			if (this.isGen2) tabIdxCounter++;
			if (lastPath === this.route2) tabIdx = tabIdxCounter;
			if (this.isGen3) tabIdxCounter++;
			if (lastPath === this.route3) tabIdx = tabIdxCounter;
			if (this.isGen4) tabIdxCounter++;
			if (lastPath === this.route4) tabIdx = tabIdxCounter;
			if (this.isGen5) tabIdxCounter++;
			if (lastPath === this.route5) tabIdx = tabIdxCounter;
		}
		this.setState({ tabIdx });
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		const retriever = this.props.ldOptions.visualInfo.retriever;
		this.generateRoutableTopFree(props, null);
		this.outputKVMap = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, UserDefDict.outputKVMapKey));
		this.icon1url = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_1_ICONURL));
		this.icon2url = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_2_ICONURL));
		this.icon3url = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_3_ICONURL));
		this.icon4url = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_4_ICONURL));
		this.icon5url = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_5_ICONURL));
		this.icon1urlDisabled = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_1_ICONURL_DISABLED));
		this.icon2urlDisabled = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_2_ICONURL_DISABLED));
		this.icon3urlDisabled = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_3_ICONURL_DISABLED));
		this.icon4urlDisabled = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_4_ICONURL_DISABLED));
		this.icon5urlDisabled = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_5_ICONURL_DISABLED));
		this.route1 = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_1_ROUTESEND));
		this.route2 = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_2_ROUTESEND));
		this.route3 = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_3_ROUTESEND));
		this.route4 = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_4_ROUTESEND));
		this.route5 = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, TAB_5_ROUTESEND));
		this.isGen1 = checkAllFilled(this.icon1url, this.icon1urlDisabled, this.route1);
		this.isGen2 = checkAllFilled(this.icon2url, this.icon2urlDisabled, this.route2);
		this.isGen3 = checkAllFilled(this.icon3url, this.icon3urlDisabled, this.route3);
		this.isGen4 = checkAllFilled(this.icon4url, this.icon4urlDisabled, this.route4);
		this.isGen5 = checkAllFilled(this.icon5url, this.icon5urlDisabled, this.route5);
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureBottomNavigation);
