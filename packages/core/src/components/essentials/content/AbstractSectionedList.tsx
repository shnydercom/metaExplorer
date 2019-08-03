import { IKvStore } from 'ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';

import { initLDLocalState, gdsfpLD, generateItptFromCompInfo } from 'components/generic/generatorFns';
import { Component, ReactNode } from 'react';
import { LDDict } from 'ldaccess/LDDict';
import { UserDefDict } from 'ldaccess/UserDefDict';

export const SectionedListName = "shnyder/material-design/SectionedList";
export const sectionHeadings = "section-headings";
export const sectionElements = "section-elements";

export const sectionedListItptKeys: string[] = [sectionElements];
export const sectionedListValueKeys: string[] = [sectionHeadings];
export const sectionedListInputKeys: string[] = [...sectionedListValueKeys, ...sectionedListItptKeys];
export const initialKVStores: IKvStore[] = [
	{ key: sectionHeadings, value: undefined, ldType: LDDict.Text },
	{ key: sectionElements, value: undefined, ldType: UserDefDict.intrprtrClassType }
];
export const SectionedListCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SectionedListName,
	initialKvStores: initialKVStores,
	interpretableKeys: sectionedListInputKeys,
	crudSkills: "cRud"
};
export type SectionedListState = LDLocalState;
export abstract class AbstractSectionedList extends Component<LDConnectedState
	& LDConnectedDispatch & LDOwnProps, SectionedListState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SectionedListState): null | SectionedListState {
		let rvLD = gdsfpLD(
			nextProps, prevState, sectionedListItptKeys, sectionedListValueKeys, null, [true], [true]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return { ...prevState, ...rvNew };
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
		const ldState = initLDLocalState(this.cfg, props, sectionedListItptKeys, sectionedListValueKeys, [true], [true]);
		this.state = { ...ldState };
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
