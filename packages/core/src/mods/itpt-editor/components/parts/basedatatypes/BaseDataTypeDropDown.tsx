import { LDBaseDataType } from 'ldaccess/LDBaseDataType';
import { LDDict } from "ldaccess/LDDict";
import { Component } from 'react';

/**
 * this component is not supposed to be used as a blueprint, only for
 * selection in the editor
 */

export interface IDataTypeLabel {
	value: LDBaseDataType;
	label: string;
	img: string;
}

export interface IDataTypeDropDownProps {
	className?: string;
	selection?: LDDict.Boolean |
	LDDict.Integer |
	LDDict.Double |
	LDDict.Text |
	LDDict.Date |
	LDDict.DateTime;
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

export class BaseDataTypeDropDown extends Component<IDataTypeDropDownProps, IDataTypeState> {

	static getDerivedStateFromProps(nextProps: IDataTypeDropDownProps, prevState: IDataTypeState): IDataTypeState {
		if (nextProps.selection) {
			if (nextProps.selection === prevState.selectedDataType) return null;
			return { selectedDataType: nextProps.selection };
		}
		return null;
	}

	constructor(props: IDataTypeDropDownProps) {
		super(props);
		this.state = { selectedDataType: 'vlBoolean' };
	}

	handleChange = (value) => {
		console.log(value)
		this.setState({ selectedDataType: value });
		this.props.selectionChange(value);
	}

	render() {
		//return <div>DropDown</div>;
		return <select name="cars"
			value={this.state.selectedDataType} onChange={(event) => this.handleChange(event.currentTarget.value)}>
			{baseDataTypes.map((val, idx) => <option key={`option-${idx}`} value={val.value}>{val.label}</option>)}
		</select>;
		/*
				return (
					<Dropdown className={this.props.className}
						onChange={this.handleChange}
						source={baseDataTypes}
						value={this.state.selectedDataType}
					/>
				);*/
	}
}
