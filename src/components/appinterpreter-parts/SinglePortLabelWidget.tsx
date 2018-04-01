import { PortWidget, DefaultPortModel } from "storm-react-diagrams";
import { SinglePortWidget } from "components/appinterpreter-parts/SinglePortWidget";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { Component } from "react";

export interface SinglePortLabelProps {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
}

export interface SinglePortLabelState {}

export class SinglePortLabel extends Component<SinglePortLabelProps, SinglePortLabelState> {
	public static defaultProps: SinglePortLabelProps = {
		in: true,
		label: "port"
	};

	render() {
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div className={(this.props.model.in ? "in" : "out") + "-port"}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
			</div>
		);
	}
}
