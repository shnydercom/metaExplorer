import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';

import { Component, ComponentClass, StatelessComponent } from 'react';
import { LDDict } from 'ldaccess/LDDict';
import { isReactComponent } from 'components/reactUtils/reactUtilFns';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { gdsfpLD, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { ThemeProvider } from 'react-css-themr';
import { editorTheme } from 'styles/editor/editorTheme';
import { appTheme } from 'styles/appTheme/appTheme';

export const ThemeProviderDarkName = "shnyder/md/ThemeProvider-dark";
export const ThemeProviderLightName = "shnyder/md/ThemeProvider-light";

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
		return <ThemeProvider theme={editorTheme}>{renderFreeResult}</ThemeProvider>;
	}
}

class PureThemeProviderLight extends PureThemeProviderDark {
	render() {
		let renderFreeResult: JSX.Element = this.renderInputContainer();
		return <ThemeProvider theme={appTheme}>{renderFreeResult}</ThemeProvider>;
	}
}

export const ThemeProviderDark = ldBlueprint(darkBpCfg)(PureThemeProviderDark);
export const ThemeProviderLight = ldBlueprint(lightBpCfg)(PureThemeProviderLight);
