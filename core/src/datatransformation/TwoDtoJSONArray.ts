import { AbstractDataTransformer } from "./abstractDataTransformer";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDDict } from "ldaccess/LDDict";

export const rowsAndCols = "rowsAndCols";
export const isFirstRowHeading = "isFirstRowHeading";
export const headings = "headings";
export const contentRow = "contentRow";

export const columnKeyAutoName = "col";

export const TwoDtoJSONArrayName: string = "data/2DtoJSONArray";

export const TwoDtoJSONArrayItptKeys: string[] = [rowsAndCols, isFirstRowHeading];
export const TwoDtoJSONArrayOutputKVs: IKvStore[] = [
	{
		key: headings,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: contentRow,
		value: undefined,
		ldType: undefined
	}
];

const initialKVStores: IKvStore[] = [
	{
		key: rowsAndCols,
		value: undefined,
		ldType: undefined
	},
	{
		key: isFirstRowHeading,
		value: undefined,
		ldType: LDDict.Boolean
	},
	...TwoDtoJSONArrayOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: TwoDtoJSONArrayName,
	initialKvStores: initialKVStores,
	interpretableKeys: TwoDtoJSONArrayItptKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class TwoDtoJSONArray extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = TwoDtoJSONArrayItptKeys;
		this.outputKvStores = TwoDtoJSONArrayOutputKVs;
	}

	/**
	 * this function turns an input such as [["a1","a2"], ["b1","b2"]]
	 * into a) [{a1: "b1", a2: "b2"}]
	 * if isFirstRowHeading is true,
	 * otherwise
	 * into b) [{col1: "a1", col2: "a2"},
	 * 					{col1: "b1", col2: "b2"}]
	 * @param inputParams
	 * @param outputKvStores
	 */
	protected mappingFunction(
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];
		let twoDArrKv = inputParams.get(rowsAndCols);
		let isExtractHeadingKv = inputParams.get(isFirstRowHeading);
		if (twoDArrKv && isExtractHeadingKv) {
			let isExtractHeading = true;
			if (!isExtractHeadingKv.value) isExtractHeading = false;
			let rowsAndColsValues = twoDArrKv.value;
			if (Array.isArray(rowsAndColsValues) &&
				Array.isArray(rowsAndColsValues[0])) {
				let headingsKeysOutput = [];
				let contentRowOutput = [];
				if (isExtractHeading
					&& Array.isArray(rowsAndColsValues[1])
					&& rowsAndColsValues[0].length === rowsAndColsValues[1].length) {
					headingsKeysOutput = rowsAndColsValues[0];
					for (let index = 1; index < rowsAndColsValues.length; index++) {
						const singleInputRow = rowsAndColsValues[index];
						let newRow = {};
						headingsKeysOutput.forEach((colKey, idx) => {
							newRow[colKey] = singleInputRow[idx];
						});
						contentRowOutput.push(newRow);
					}
				} else {
					let keyLen = rowsAndColsValues.length;
					rowsAndColsValues.forEach((rowVal) => {
						let newRowObj = {};
						for (let colIdx = 0; colIdx < keyLen; colIdx++) {
							const newRowName =  + colIdx;
							if (colIdx === 0) {
								headingsKeysOutput.push(newRowName);
							}
							try {
								newRowObj[newRowName] = rowVal[colIdx];
							} catch (error) {

								newRowObj[newRowName] = null;
							}
						}
						contentRowOutput.push(newRowObj);
					});
				}
				const headingsOutputKV = outputKvStores.get(headings);
				headingsOutputKV.value = headingsKeysOutput;
				const contentRowOutputKV = outputKvStores.get(contentRow);
				contentRowOutputKV.value = contentRowOutput;
				rv = [
					headingsOutputKV,
					contentRowOutputKV
				];
			}
		}
		return rv;
	}
}
