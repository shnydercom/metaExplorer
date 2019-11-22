import {ldBlueprint, AbstractSimpleTextTable, simpleTextTableCfg, LDUIDict } from '@metaexplorer/core';
import { TableBody, Table, TableHead, TableRow, TableCell } from '@material-ui/core';
import React from 'react';

export const MD_SIMPLE_TEXT_TABLE_NAME = "metaexplorer.io/material-design/SimpleTextTable";

export const MD_SIMPLE_TEXT_TABLE_CFG = {...simpleTextTableCfg};
MD_SIMPLE_TEXT_TABLE_CFG.nameSelf = MD_SIMPLE_TEXT_TABLE_NAME;

@ldBlueprint(MD_SIMPLE_TEXT_TABLE_CFG)
export class MDSimpleTextTable extends AbstractSimpleTextTable {

	render() {
		const { localValues } = this.state;
		const headingRow = localValues.get(LDUIDict.headings);
		const contentRows = localValues.get(LDUIDict.tuples);
		if (!headingRow || !contentRows) return null;
		return <Table>
			<TableHead>
				<TableRow>
					{
						(headingRow as string[]).map((headingRowElem, hIdx) => {
							return <TableCell key={"h" + hIdx}>{headingRowElem}</TableCell>;
						})
					}
				</TableRow>
			</TableHead>
			<TableBody>
				{contentRows.map((contentRow, rowIdx) => (
					<TableRow key={rowIdx}>
						{
							headingRow.map((contentKey, cIdx) => (
								<TableCell key={"c" + cIdx}>{contentRow[contentKey]}</TableCell>
							))
						}
					</TableRow>
				))}
			</TableBody>
		</Table>;
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
