import { IKvStore } from 'ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';

import { initLDLocalState, gdsfpLD } from 'components/generic/generatorFns';
import { Component, ReactNode } from 'react';

export const SimpleTextTableName = "shnyder/material-design/SimpleTextTable";
export const tableHeadings = "headings";
export const tableRows = "rows";

let simpleTextTableInputKeys: string[] = [tableHeadings, tableRows];
let initialKVStores: IKvStore[] = [
	{ key: tableHeadings, value: undefined, ldType: undefined },
	{ key: tableRows, value: undefined, ldType: undefined }
];
export const simpleTextTableCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SimpleTextTableName,
	initialKvStores: initialKVStores,
	interpretableKeys: simpleTextTableInputKeys,
	crudSkills: "cRud"
};
export interface SimpleTextTableState extends LDLocalState {
}

export abstract class AbstractSimpleTextTable extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SimpleTextTableState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SimpleTextTableState): null | SimpleTextTableState {
		let rvLocal = gdsfpLD(nextProps, prevState, [], simpleTextTableInputKeys);
		if (!rvLocal) {
			return null;
		}
		let rvNew = { ...rvLocal };
		return { ...prevState, ...rvNew };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], simpleTextTableInputKeys);
		this.state = { ...ldState };
	}

	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
