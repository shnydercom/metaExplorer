import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';

import { initLDLocalState, gdsfpLD } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { Table, TableTheme, TableHead, TableCell, TableRow } from 'react-toolbox/lib/table/';
import { AbstractSimpleTextTable, tableHeadings, tableRows, simpleTextTableCfg } from 'components/md/content/AbstractSimpleTextTable';

@ldBlueprint(simpleTextTableCfg)
export class MDSimpleTextTable extends AbstractSimpleTextTable {

	render() {
		const { localValues } = this.state;
		const headingRow = localValues.get(tableHeadings);
		const contentRows = localValues.get(tableRows);
		if (!headingRow || !contentRows) return null;
		return <div>MDSimpleTextTable</div>;
		/*<Table>
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
		</Table>;*/
	}
}
