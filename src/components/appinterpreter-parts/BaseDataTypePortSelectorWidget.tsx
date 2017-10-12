import * as React from "react";
import { PortWidget, DefaultPortModel } from "storm-react-diagrams";
import { SinglePortWidget } from "components/appinterpreter-parts/SinglePortWidget";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { BaseDataTypeDropDown } from "components/basedatatypeinterpreter/BaseDataTypeDropDown";

export interface BaseDataTypePortSelectorProps {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
}

export interface BaseDataTypePortSelectorState {}

export class BaseDataTypePortSelector extends React.Component<BaseDataTypePortSelectorProps, BaseDataTypePortSelectorState> {
	public static defaultProps: BaseDataTypePortSelectorProps = {
		in: true,
		label: "port"
	};

	render() {
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div className={("out") + "-port"}>
				{label}
				<BaseDataTypeDropDown	/>
				{port}
			</div>
		);
	}
}
