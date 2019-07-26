import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import { generateItptFromCompInfo, gdsfpLD, initLDLocalState } from '../../generic/generatorFns';
import { checkAllFilled } from 'GeneralUtils';
import { Component, ReactNode } from 'react';

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

export const LABELS: string[] = [
	"Labels_1",
	"Labels_2",
	"Labels_3",
	"Labels_4",
	"Labels_5"
];

export const BOTTOMNAV_VALUE_FIELDS: string[] = [
	...ICON_URLS,
	...ICON_URLS_DISABLED,
	...ROUTES_SEND,
	...LABELS,
	VisualKeysDict.cssClassName,
	UserDefDict.outputKVMapKey
];

export const CHANGED_ROUTE_OUTPUT = "ChangedRoute";

export const BottomNavigationName = "shnyder/material-design/BottomNavigation";
export const TopNavigationName = "shnyder/material-design/TopNavigation";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];

for (let i = 0; i < ICON_URLS.length; i++) {
	cfgIntrprtKeys.push(ICON_URLS[i]);
	cfgIntrprtKeys.push(ICON_URLS_DISABLED[i]);
	cfgIntrprtKeys.push(ROUTES_SEND[i]);
	cfgIntrprtKeys.push(LABELS[i]);
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
		ldType: VisualTypesDict.route_added
	});
	initialKVStores.push({
		key: LABELS[i],
		value: undefined,
		ldType: LDDict.Text
	});
}
cfgIntrprtKeys.push(VisualKeysDict.cssClassName);
initialKVStores.push({
	key: VisualKeysDict.cssClassName,
	value: undefined,
	ldType: LDDict.Text
});

initialKVStores.push({
	key: CHANGED_ROUTE_OUTPUT,
	value: undefined,
	ldType: VisualTypesDict.route_added
});

export const BottomNavW5ChoicesBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: BottomNavigationName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export const TopNavW5ChoicesBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: TopNavigationName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface BottomNavState extends LDLocalState {
	isInitial: boolean;
	tabIdx: number;
	iconEnabledURLs: string[];
	iconDisabledURLs: string[];
	routes: string[];
	isGenerateAtPositions: boolean[];
	labels: string[];
	hasTabChanged: boolean;
	numTabs: number;
}

export abstract class AbstractBottomNavigation extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, BottomNavState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | BottomNavState & LDLocalState)
		: null | BottomNavState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], BOTTOMNAV_VALUE_FIELDS);
		let rvNew;
		if (!rvLD) {
			if (prevState.isInitial) {
				rvNew = prevState;
			} else {
				return null;
			}
		} else {
			rvNew = { ...rvLD, };
		}
		const iconEnabledURLs: string[] = [];
		const iconDisabledURLs: string[] = [];
		const routes: string[] = [];
		const isGenerateAtPositions: boolean[] = [];
		const labels: string[] = [];
		//handle KVs
		for (let idx = 0; idx < prevState.numTabs; idx++) {
			iconEnabledURLs[idx] = rvNew.localValues.get(ICON_URLS[idx]);
			iconDisabledURLs[idx] = rvNew.localValues.get(ICON_URLS_DISABLED[idx]);
			routes[idx] = rvNew.localValues.get(ROUTES_SEND[idx]);
			labels[idx] = rvNew.localValues.get(LABELS[idx]);
			isGenerateAtPositions[idx] = checkAllFilled(
				iconEnabledURLs[idx],
				iconDisabledURLs[idx],
				routes[idx],
				labels[idx]
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
			//if (!match.params) match.params = { nextPath: null };

			let tabIdxCounter = 0;
			if (!prevState.hasTabChanged || prevState.isInitial) {
				let lastPath = location.pathname.replace(match.path, "");
				let isOnTopLayer = false;
				if (match.path === '/') {
					isOnTopLayer = true;
				}
				//lastPath = lastPath.startsWith("/") ? lastPath.substr(1) : lastPath;
				//lastPath = lastPath.split("/")[0];
				for (let idx = 0; idx < prevState.numTabs; idx++) {
					if (lastPath === routes[idx] || (isOnTopLayer && ('/' + lastPath === routes[idx]))) tabIdx = tabIdxCounter;
					if (isGenerateAtPositions[idx]) tabIdxCounter++;
				}
			}
		}
		return {
			...prevState, ...rvNew,
			isInitial: false,
			tabIdx,
			iconEnabledURLs,
			iconDisabledURLs,
			labels,
			routes,
			isGenerateAtPositions
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			isInitial: true,
			tabIdx: 0,
			numTabs: 5,
			iconEnabledURLs: [],
			iconDisabledURLs: [],
			labels: [],
			routes: [],
			isGenerateAtPositions: [],
			hasTabChanged: true,
			...initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer], BOTTOMNAV_VALUE_FIELDS)
		};
	}

	onTabChanged = (tabIdx) => {
		if (this.state.tabIdx !== tabIdx) {
			this.setState({ ...this.state, tabIdx, hasTabChanged: true });
		}
		const outRouteKV: IKvStore = {
			key: CHANGED_ROUTE_OUTPUT,
			value: undefined,
			ldType: VisualTypesDict.route_added
		};
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		this.props.dispatchKvOutput([outRouteKV], this.props.ldTokenString, outputKVMap);
	}

	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
