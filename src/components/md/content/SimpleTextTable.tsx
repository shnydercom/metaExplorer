import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';

import { initLDLocalState, gdsfpLD } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { Table, TableTheme, TableHead, TableCell, TableRow } from 'react-toolbox/lib/table/';

export const SimpleTextTableName = "shnyder/md/SimpleTextTable";
const tableHeadings = "headings";
const tableRows = "rows";

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

@ldBlueprint(simpleTextTableCfg)
export class PureSimpleTextTable extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SimpleTextTableState>
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
	render() {
		const { localValues } = this.state;
		const headingRow = localValues.get(tableHeadings);
		const contentRows = localValues.get(tableRows);
		if (!headingRow || !contentRows) return null;
		return <Table>
			<TableHead>
				{
					(headingRow as string[]).map((headingRowElem, hIdx) => {
						return <TableCell key={"h" + hIdx}>{headingRowElem}</TableCell>;
					})
				}
			</TableHead>
			{contentRows.map((contentRow, rowIdx) => (
				<TableRow key={rowIdx}>
					{
						headingRow.map((contentKey, cIdx) => (
							<TableCell key={"c" + cIdx}>{contentRow[contentKey]}</TableCell>
						))
					}
				</TableRow>
			))}
		</Table>;
	}
}
