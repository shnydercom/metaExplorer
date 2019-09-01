import { IKvStore, ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap, ILDOptions,
	LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState ,UserDefDict, VisualKeysDict,
	gdsfpLD, generateItptFromCompInfo, initLDLocalState
 } from '@metaexplorer/core';

import { Component } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import React from 'react';

import * as darkThemeJson from '../../../themes/metaexplorer-mui-theme-dark.json';

import * as lightThemeJson from '../../../themes/metaexplorer-mui-theme-light.json';
/*import { ThemeProvider } from 'react-css-themr';
import { editorTheme } from 'styles/editor/editorTheme';
import { appTheme } from 'styles/appTheme/appTheme';*/

export const ThemeProviderDarkName = "metaexplorer.io/material-design/ThemeProvider-dark";
export const ThemeProviderLightName = "metaexplorer.io/material-design/ThemeProvider-light";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer];

let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];

let darkBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ThemeProviderDarkName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

let lightBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ThemeProviderLightName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface ThemeProviderDarkState extends LDLocalState {
}

const lightPalette = {
	primary: { main: '#FAFAFA', contrastText: '#2b2b2b' },
	secondary: { main: '#86c5f2', contrastText: '#ffffff' }
};
//const themeNameLight = 'MetaExplorer Material-UI Theme light';

const lightTheme = createMuiTheme({ ...lightThemeJson as any, palette: lightPalette });

const darkPalette = {
  primary: { main: '#00375f' },
  secondary: { main: '#86c5f2', contrastText: '#00375f' }
};

//const themeNameDark = 'MetaExplorer Material-UI Theme dark';

const darkTheme = createMuiTheme({
	...darkThemeJson as any,
	palette: darkPalette
});

class PureThemeProviderDark extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, ThemeProviderDarkState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: ThemeProviderDarkState): null | ThemeProviderDarkState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], []);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew
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
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer],
			[]);
		this.state = {
			...ldState,
		};
	}
	render() {
		let renderFreeResult: JSX.Element = this.renderInputContainer();
		if(!renderFreeResult) return null;
		return <ThemeProvider theme={darkTheme}>{renderFreeResult}</ThemeProvider>;
	}
}

class PureThemeProviderLight extends PureThemeProviderDark {
	render() {
		let renderFreeResult: JSX.Element = this.renderInputContainer();
		if(!renderFreeResult) return null;
		return <ThemeProvider theme={lightTheme}>{renderFreeResult}</ThemeProvider>;
	}
}

export const ThemeProviderDark = ldBlueprint(darkBpCfg)(PureThemeProviderDark);
export const ThemeProviderLight = ldBlueprint(lightBpCfg)(PureThemeProviderLight);
