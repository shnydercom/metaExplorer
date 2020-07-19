import { IKvStore } from '../../ldaccess/ikvstore';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';
import { UserDefDict } from '../../ldaccess/UserDefDict';
import { VisualKeysDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from '../generic/generatorFns';
import { Component } from 'react';
import { LDDict } from '../../ldaccess/LDDict';
import { isReactComponent } from '../../components/reactUtils/reactUtilFns';
import React from 'react';

export const CSSWrapperName = "metaexplorer.io/layout/CSSWrapper";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, VisualKeysDict.cssClassName];

let ownKVL: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
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
	ownKVL: ownKVL,
	inKeys: cfgIntrprtKeys,
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
			nextProps, prevState, [VisualKeysDict.inputContainer], [VisualKeysDict.cssClassName], null, [false], [true]);
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
	ownKVL: IKvStore[];
	styleClassName: string;

	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer],
			[VisualKeysDict.cssClassName], [false], [true]);
		this.state = {
			...ldState,
		};
	}
	render() {
		let renderFreeResult: JSX.Element = this.renderInputContainer();
		const { localValues } = this.state;
		if (isReactComponent(renderFreeResult)) {
			const cssClassNames: string[] = localValues.get(VisualKeysDict.cssClassName);
			if (!!renderFreeResult && !!cssClassNames /*&& renderFreeResult.hasOwnProperty("className")*/) {
				/*renderFreeResult["className"] = cssClassName;*/
				const cssClassStrings = cssClassNames.join(" ");
				return <div className={cssClassStrings}>{renderFreeResult}</div>;
			}
		}
		return <>{renderFreeResult}</>;
	}
}
