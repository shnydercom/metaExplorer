import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDRouteProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../../visualcomposition/visualDict';

import { Tab } from 'react-toolbox/lib/tabs/';
import { Tabs } from 'react-toolbox/lib/tabs/';

import { generateIntrprtrForProp, generateItptFromCompInfo, getDerivedItptStateFromProps, getDerivedKVStateFromProps, initLDLocalState } from '../../generic/generatorFns';
import { checkAllFilled } from 'GeneralUtils';
import { Redirect, Route } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { NetworkPreferredToken } from 'ldaccess/ildtoken';

export const ICON_URLS: string[] = [
	"IconURL_1",
	"IconURL_2",
	"IconURL_3",
	"IconURL_4",
	"IconURL_5",
];
export const ICON_URLS_DISABLED: string[] = [
	"IconURL_1_Disabled",
	"IconURL_2_Disabled",
	"IconURL_3_Disabled",
	"IconURL_4_Disabled",
	"IconURL_5_Disabled"
];
export const ROUTES_SEND: string[] = [
	"RouteSend_1",
	"RouteSend_2",
	"RouteSend_3",
	"RouteSend_4",
	"RouteSend_5"
];

export const BOTTOMNAV_VALUE_FIELDS: string[] = [
	...ICON_URLS,
	...ICON_URLS_DISABLED,
	...ROUTES_SEND,
	UserDefDict.outputKVMapKey
];

export const CHANGED_ROUTE_OUTPUT = "ChangedRoute";

export const BottomNavigationName = "shnyder/md/BottomNavigation";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];

for (let i = 0; i < ICON_URLS.length; i++) {
	cfgIntrprtKeys.push(ICON_URLS[i]);
	cfgIntrprtKeys.push(ICON_URLS_DISABLED[i]);
	cfgIntrprtKeys.push(ROUTES_SEND[i]);
	initialKVStores.push({
		key: ICON_URLS[i],
		value: undefined,
		ldType: LDDict.Text
	});
	initialKVStores.push({
		key: ICON_URLS_DISABLED[i],
		value: undefined,
		ldType: LDDict.Text
	});
	initialKVStores.push({
		key: ROUTES_SEND[i],
		value: undefined,
		ldType: VisualDict.route_added
	});
}
initialKVStores.push({
	key: CHANGED_ROUTE_OUTPUT,
	value: undefined,
	ldType: VisualDict.route_added
});

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: BottomNavigationName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface BottomNavState extends LDLocalState {
	tabIdx: number;
	iconEnabledURLs: string[];
	iconDisabledURLs: string[];
	routes: string[];
	isGenerateAtPositions: boolean[];
	hasTabChanged: boolean;
	numTabs: number;
}
@ldBlueprint(bpCfg)
export class PureBottomNavigation extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, BottomNavState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | BottomNavState & LDLocalState)
		: null | BottomNavState & LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, BOTTOMNAV_VALUE_FIELDS);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		const iconEnabledURLs: string[] = [];
		const iconDisabledURLs: string[] = [];
		const routes: string[] = [];
		const isGenerateAtPositions: boolean[] = [];
		//handle KVs
		for (let idx = 0; idx < prevState.numTabs; idx++) {
			iconEnabledURLs[idx] = rvNew.localValues.get(ICON_URLS[idx]);
			iconDisabledURLs[idx] = rvNew.localValues.get(ICON_URLS_DISABLED[idx]);
			routes[idx] = rvNew.localValues.get(ROUTES_SEND[idx]);
			isGenerateAtPositions[idx] = checkAllFilled(
				iconEnabledURLs[idx],
				iconDisabledURLs[idx],
				routes[idx]
			);
		}
		//handle routes if some tabs are not entirely filled
		let tabIdx = prevState.tabIdx;
		if (nextProps.routes) {
			const { match } = nextProps.routes;
			if (!match) {
				console.error("BottomNavigation: No route information passed to BottomNavigation, can't switch tabs");
				return null;
			}
			if (!match.params) match.params = { nextPath: null };
			if (match.params.nextPath) {
				let tabIdxCounter = 0;
				const lastPath = match.params.nextPath;
				for (let idx = 0; idx < prevState.numTabs; idx++) {
					if (lastPath === routes[idx]) tabIdx = tabIdxCounter;
					if (isGenerateAtPositions[idx]) tabIdxCounter++;
				}
			}
		}
		return {
			...prevState, ...rvNew,
			tabIdx,
			iconEnabledURLs,
			iconDisabledURLs,
			routes,
			isGenerateAtPositions
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
		this.state = {
			tabIdx: 0,
			numTabs: 5,
			iconEnabledURLs: [],
			iconDisabledURLs: [],
			routes: [],
			isGenerateAtPositions: [],
			hasTabChanged: true,
			...initLDLocalState(this.cfg, props, [VisualDict.freeContainer], BOTTOMNAV_VALUE_FIELDS)
		};
	}

	/*componentWillMount() {
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
	}*/
	onTabChanged = (tabIdx) => {
		if (this.state.tabIdx !== tabIdx) {
			this.setState({ ...this.state, tabIdx, hasTabChanged: true });
		}
		const outRouteKV: IKvStore = {
			key: CHANGED_ROUTE_OUTPUT,
			value: undefined,
			ldType: VisualDict.route_added
		};
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		this.props.dispatchKvOutput([outRouteKV], this.props.ldTokenString, outputKVMap);

		/*
		let ldOptions: ILDOptions = {
			isLoading: false,
			lang: "en",
			ldToken: new NetworkPreferredToken("someToken"),
			resource: null,
			visualInfo: { retriever: "default" }
		};
		this.props.notifyLDOptionsChange(ldOptions);*/
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
		if (!this.props.routes || !this.state.hasTabChanged) return null;
		const { match, location } = this.props.routes;
		let route: string = this.state.routes[tabIdx];
		if (match.params.nextPath === undefined) match.params.nextPath = route;
		/*switch (tabIdx) {
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
		}*/
		let newPath: string = match.url.endsWith("/") ? match.url + route : `${match.url}/${route}`;
		this.setState({ ...this.state, hasTabChanged: false });
		//this.hasTabChanged = false;
		//this.generateRoutableTopFree(this.props, route);
		//if (location.pathname === newPath) return null;
		return <Redirect to={newPath} />;
	}

	/*generateRoutableTopFree(props: LDOwnProps & LDConnectedState, nextPath: string) {
		let kvs: IKvStore[];
		console.log("generateRoutableTopFree called");
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
	}*/

	//bsCompExecFn = () => <>{this.topFreeContainer}</>;

	render() {
		const { numTabs, isGenerateAtPositions, iconEnabledURLs, iconDisabledURLs, routes, tabIdx } = this.state;

		let tabs = [];
		for (let idx = 0; idx < numTabs; idx++) {
			const isGen = isGenerateAtPositions[idx];
			if (!isGen) continue;
			let newTab = this.generateTab(
				iconEnabledURLs[idx],
				iconDisabledURLs[idx],
				routes[idx],
				tabIdx === idx);
			tabs.push(newTab);
		}
		return <div className="bottom-nav">
			<div className="bottom-nav-topfree mdscrollbar">
				{this.generateRedirect(tabIdx)}
				<Route component={this.renderFreeContainer} />
				{this.props.children}
			</div>
			<Tabs index={tabIdx} onChange={this.onTabChanged} fixed className="bottom-nav-tabs">
				{tabs}
			</Tabs>
		</div>;
	}
	/*
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
		}*/
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureBottomNavigation);
