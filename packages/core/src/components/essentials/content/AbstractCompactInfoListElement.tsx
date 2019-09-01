import { IKvStore } from '../../../ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../../ldaccess/ldBlueprint';

import { LDLocalState, LDConnectedState, LDConnectedDispatch, LDOwnProps } from '../../../appstate/LDProps';
import { Component, ReactNode } from 'react';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { UserDefDict } from '../../../ldaccess/UserDefDict';
import { initLDLocalState, generateItptFromCompInfo, gdsfpLD } from '../../../components/generic/generatorFns';
import { VisualTypesDict, VisualKeysDict } from '../../../components/visualcomposition/visualDict';
import { LDDict } from '../../../ldaccess/LDDict';

export const CompactInfoListElementName = "metaexplorer.io/CompactInfoListElement";

let CompactInfoListElementItptKeys: string[] = [VisualKeysDict.primaryItpt, VisualKeysDict.secondaryItpt];
let compactInfoListElementValueKeys: string[] = [VisualKeysDict.headerTxt, VisualKeysDict.subHeaderTxt];
let CompactInfoListElementInputKeys: string[] = [...CompactInfoListElementItptKeys, ...compactInfoListElementValueKeys];

let initialKVStores: IKvStore[] = [
	{ key: VisualKeysDict.primaryItpt, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: VisualKeysDict.secondaryItpt, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: VisualKeysDict.headerTxt, value: undefined, ldType: LDDict.Text },
	{ key: VisualKeysDict.subHeaderTxt, value: undefined, ldType: LDDict.Text },
];
export const CompactInfoListElementCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: CompactInfoListElementName,
	initialKvStores: initialKVStores,
	interpretableKeys: CompactInfoListElementInputKeys,
	crudSkills: "cRud",
	canInterpretType: VisualTypesDict.compactInfoElement
};
export type CompactInfoListElementState = LDLocalState;

export abstract class AbstractCompactInfoListElement extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, CompactInfoListElementState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: CompactInfoListElementState): null | CompactInfoListElementState {
		let rvNew = gdsfpLD(nextProps, prevState, CompactInfoListElementItptKeys, compactInfoListElementValueKeys,
			CompactInfoListElementCfg.canInterpretType,
			[false, false], [false, false]);
		return { ...prevState, ...rvNew, };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	protected renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, CompactInfoListElementItptKeys, compactInfoListElementValueKeys);
		this.state = { ...ldState };
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
