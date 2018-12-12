import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';

import { LDLocalState, LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';
import { Component } from 'react';
import { ILDOptions } from 'ldaccess/ildoptions';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { getDerivedKVStateFromProps, initLDLocalState, getDerivedItptStateFromProps, generateItptFromCompInfo } from 'components/generic/generatorFns';
import { VisualTypesDict, VisualKeysDict } from 'components/visualcomposition/visualDict';
import { LDDict } from 'ldaccess/LDDict';
import { ListItem } from 'react-toolbox/lib/list';

export const CompactInfoListElementName = "shnyder/CompactInfoListElement";
export const magicCanInterpretType = VisualTypesDict.compactInfoElement;

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
	canInterpretType: magicCanInterpretType
};
export interface CompactInfoListElementState extends LDLocalState {
}

@ldBlueprint(CompactInfoListElementCfg)
export class PureCompactInfoListElement extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, CompactInfoListElementState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: CompactInfoListElementState): null | CompactInfoListElementState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, CompactInfoListElementItptKeys);
		let rvLocal = getDerivedKVStateFromProps(nextProps, prevState, compactInfoListElementValueKeys);
		if (!rvLocal && !rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return { ...prevState, ...rvNew, };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, CompactInfoListElementItptKeys, compactInfoListElementValueKeys);
		this.state = { ...ldState };
	}

	render() {
		const { localValues } = this.state;
		return <ListItem leftIcon={this.renderSub(VisualKeysDict.primaryItpt)}
			rightIcon={this.renderSub(VisualKeysDict.secondaryItpt)}
			caption={localValues.get(VisualKeysDict.headerTxt)}
			legend={localValues.get(VisualKeysDict.subHeaderTxt)} />;
	}
}
