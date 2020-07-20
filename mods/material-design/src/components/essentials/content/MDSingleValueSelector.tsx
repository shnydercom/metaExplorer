import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import { ldBlueprint, AbstractSingleValueSelector, SingleValueSelectorBpCfg, LDDict, KVL } from "@metaexplorer/core";
import shortid from "shortid";

export const MD_SINGLE_VALUE_SELECTOR_NAME = "metaexplorer.io/material-design/SingleValueSelector";
export const MD_SINGLE_VALUE_SELECTOR_CFG = { ...SingleValueSelectorBpCfg };

MD_SINGLE_VALUE_SELECTOR_CFG.nameSelf = MD_SINGLE_VALUE_SELECTOR_NAME;

export interface IMDValueSelectOption {
	id: string;
	value: string;
	label: string;
}

function mapActionOptionToMDValueSelectOption(actionOption: KVL, id: string): IMDValueSelectOption {
	const val: {} = actionOption.value;
	console.log(val);
	return {
		id,
		value: "TODO:demoValue",
		label: "TODO:demoLabel",
	}
}

@ldBlueprint(MD_SINGLE_VALUE_SELECTOR_CFG)
export class MDSingleValueSelector extends AbstractSingleValueSelector {
	render() {
		const { localValues } = this.state;
		//const description = localValues.get(LDDict.description);
		const actionOption = localValues.get(LDDict.actionOption);
		const schemaObject = localValues.get(LDDict.object);
		let options: IMDValueSelectOption[] = [];
		let selOption: any = {};
		if (actionOption) {
			options = (actionOption as []).map(
				(singleActionOption) =>
					mapActionOptionToMDValueSelectOption(singleActionOption, `${shortid.generate()}`))
		}
		if(schemaObject){
			selOption = schemaObject;
		}
		console.dir(this.state);
		return <Select
			value={selOption}
			fullWidth={true}>
			{
				options.map(option => (
					<MenuItem key={`${option.id}`} value={option.value}>
						{option.label}
					</MenuItem>
				))
			}
		</Select>
	}
}