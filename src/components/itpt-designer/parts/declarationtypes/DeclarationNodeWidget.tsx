import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { DeclarationPartNodeModel } from "./DeclarationNodeModel";
import { Component, createFactory, ClassAttributes, ComponentElement, ReactElement, ReactPortal } from "react";
import { map } from "lodash";

export interface DeclarationNodeProps {
	node: DeclarationPartNodeModel;
	diagramEngine: DiagramEngine;
}

export interface DeclarationTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class DeclarationNodeWidget extends Component<DeclarationNodeProps, DeclarationTypeNodeState> {
	constructor(props: DeclarationNodeProps) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
		//return <GeneralDataTypePortSelector model={port} key={port.id} />;
	}

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div className="title">
					<div className="name">{this.props.node.nameSelf}</div>
				</div>
				<div className="ports">
					<div className="in">{map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

export var DeclarationNodeWidgetFactory = createFactory(DeclarationNodeWidget);
