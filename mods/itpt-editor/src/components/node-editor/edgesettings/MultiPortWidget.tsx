import { NodeModel } from "@projectstorm/react-diagrams";
import { Component } from "react";
import React from "react";

export interface PortProps {
	name: string;
	node: NodeModel;
}

export interface PortState {
	selected: boolean;
}

/**
 * @author Jonathan Schneider
 */
export class MultiPortWidget extends Component<PortProps, PortState> {
	constructor(props: PortProps) {
		super(props);
		this.state = {
			selected: false
		};
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
				className={"port" + (this.state.selected ? " selected" : "")}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}
