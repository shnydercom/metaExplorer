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

export const ThemeProviderDarkName = "shnyder/md/ThemeProvider-dark";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.freeContainer];

let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ThemeProviderDarkName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface ThemeProviderDarkState extends LDLocalState {
}

@ldBlueprint(bpCfg)
export class PureThemeProviderDark extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, ThemeProviderDarkState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: ThemeProviderDarkState): null | ThemeProviderDarkState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.freeContainer], []);
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

	protected renderFreeContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.freeContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.freeContainer],
			[]);
		this.state = {
			...ldState,
		};
	}
	render() {
		let renderFreeResult: JSX.Element = this.renderFreeContainer();
		return <ThemeProvider theme={editorTheme}>{renderFreeResult}</ThemeProvider>;
	}
}
