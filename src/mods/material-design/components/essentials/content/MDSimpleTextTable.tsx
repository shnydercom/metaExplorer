import ldBlueprint, {  } from 'ldaccess/ldBlueprint';
import { AbstractSimpleTextTable, tableHeadings, tableRows, simpleTextTableCfg } from 'components/essentials/content/AbstractSimpleTextTable';

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
