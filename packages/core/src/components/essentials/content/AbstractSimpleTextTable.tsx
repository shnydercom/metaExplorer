import { IKvStore } from '../../../ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';

import { initLDLocalState, gdsfpLD } from '../../../components/generic/generatorFns';
import { Component, ReactNode } from 'react';
import { LDUIDict } from '../../../ldaccess/LDUIDict';
import { createLDUINSUrl, LDDict } from '../../../ldaccess';

const SimpleTextTableName = "metaexplorer.io/core/SimpleTextTable";

const viewSimpleTextTableAction = createLDUINSUrl(LDDict.ViewAction, LDDict.object, LDUIDict.TupleTextTable);

let simpleTextTableInputKeys: string[] = [LDUIDict.headings, LDUIDict.tuples];
let initialKVStores: IKvStore[] = [
	{ key: LDUIDict.headings, value: undefined, ldType: undefined },
	{ key: LDUIDict.tuples, value: undefined, ldType: undefined }
];
export const simpleTextTableCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: viewSimpleTextTableAction,
	nameSelf: SimpleTextTableName,
	initialKvStores: initialKVStores,
	interpretableKeys: simpleTextTableInputKeys,
	crudSkills: "cRud"
};
export type SimpleTextTableState = LDLocalState;

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
