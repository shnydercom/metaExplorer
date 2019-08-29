import { NodeModel, BaseWidget, BaseWidgetProps } from "@projectstorm/react-diagrams";
import React from "react";

export interface PortProps extends BaseWidgetProps {
	name: string;
	node: NodeModel;
	isMulti: boolean;
}

export interface PortState {
	selected: boolean;
}

/**
 * @author Jonathan Schneider
 */
export class SinglePortWidget extends BaseWidget<PortProps, PortState> {
	constructor(props: PortProps) {
		super("srd-port", props);
		this.state = {
			selected: false
		};
	}

	getClassName() {
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				className={"port" + (this.state.selected ? " selected" : "") + (this.props.isMulti ? " isMulti" : "")}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}
