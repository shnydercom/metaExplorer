import * as React from "react";
import { Dropdown, DropdownTheme } from 'react-toolbox/lib/dropdown';
import { LDBaseDataType } from 'ldaccess/LDBaseDataType';
import { LDDict } from "ldaccess/LDDict";

/**
 * this component is not supposed to be used as a blueprint, only for
 * selection in the designer
 */

export interface IDataTypeLabel {
	value: LDBaseDataType;
	label: string;
	img: string;
}

export interface IDataTypeDropDownProps {
	selectionChange: (selectedDataType: string) => void;
}

export interface IDataTypeState {
	selectedDataType: string;
}

const baseDataTypes: IDataTypeLabel[] = [
	{ value: LDDict.Boolean, label: 'Boolean', img: null },
	{ value: LDDict.Integer, label: 'Integer', img: null },
	{ value: LDDict.Double, label: 'Double', img: null },
	{ value: LDDict.Text, label: 'Text', img: null },
	{ value: LDDict.Date, label: 'Date', img: null },
	{ value: LDDict.DateTime, label: 'DateTime', img: null },
];

export class BaseDataTypeDropDown extends React.Component<IDataTypeDropDownProps, IDataTypeState> {

	constructor(props: IDataTypeDropDownProps) {
		super(props);
		this.state = { selectedDataType: 'vlBoolean' };
	}

	handleChange = (value) => {
		this.setState({ selectedDataType: value });
		this.props.selectionChange(value);
	}

	render() {
		return (
			<Dropdown
				onChange={this.handleChange}
				source={baseDataTypes}
				value={this.state.selectedDataType}
			/>
		);
	}
}
