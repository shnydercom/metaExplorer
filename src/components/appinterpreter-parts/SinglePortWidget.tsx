import * as React from "react";
import { InterpreterNodeModel } from "./InterpreterNodeModel";
import { NodeModel } from "storm-react-diagrams";

export interface PortProps {
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
export class SinglePortWidget extends React.Component<PortProps, PortState> {
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
				className={"port" + (this.state.selected ? " selected" : "") + (this.props.isMulti ? " isMulti" : "")}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}
