import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from '../generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { LDDict } from 'ldaccess/LDDict';
import { isReactComponent } from 'components/reactUtils/reactUtilFns';

export const CSSWrapperName = "shnyder/layout/CSSWrapper";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.freeContainer, VisualKeysDict.cssClassName];

let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	}
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: CSSWrapperName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface CSSWrapperState extends LDLocalState {
}

@ldBlueprint(bpCfg)
export class PureCSSWrapper extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, CSSWrapperState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: CSSWrapperState): null | CSSWrapperState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.freeContainer], [VisualKeysDict.cssClassName]);
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
	styleClassName: string;

	protected renderFreeContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.freeContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.freeContainer],
			[VisualKeysDict.cssClassName]);
		this.state = {
			...ldState,
		};
	}
	render() {
		let renderFreeResult: JSX.Element = this.renderFreeContainer();
		const { localValues } = this.state;
		if (isReactComponent(renderFreeResult)) {
			const cssClassName = localValues.get(VisualKeysDict.cssClassName);
			if (!!renderFreeResult && !!cssClassName /*&& renderFreeResult.hasOwnProperty("className")*/) {
				/*renderFreeResult["className"] = cssClassName;*/
				return <div className={cssClassName}>{renderFreeResult}</div>;
			}
		}
		return <>{renderFreeResult}</>;
	}
}
