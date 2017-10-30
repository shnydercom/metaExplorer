import * as React from "react";
import * as _ from "lodash";
import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { SinglePortWidget } from './SinglePortWidget';

export interface GeneralDataTypeNodeProps {
	node: DefaultNodeModel;
	diagramEngine: DiagramEngine;
}

export interface GeneralDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class GeneralDataTypeNodeWidget extends React.Component<GeneralDataTypeNodeProps, GeneralDataTypeNodeState> {
	constructor(props: GeneralDataTypeNodeProps) {
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
					<div className="name">{this.props.node.name}</div>
				</div>
				<div className="ports">
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

export var GeneralDataTypeNodeWidgetFactory = React.createFactory(GeneralDataTypeNodeWidget);
