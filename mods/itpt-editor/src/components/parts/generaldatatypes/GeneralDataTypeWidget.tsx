import { DefaultPortLabel, DiagramEngine, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { map } from 'lodash';
import { GENERALDATATYPE_MODEL } from "../editor-consts";
import React from "react";

export interface GeneralDataTypeNodeProps extends BaseWidgetProps {
	node: GeneralDataTypeNodeModel;
	diagramEngine: DiagramEngine;
}

export interface GeneralDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class GeneralDataTypeNodeWidget extends BaseWidget<GeneralDataTypeNodeProps, GeneralDataTypeNodeState> {
	constructor(props: GeneralDataTypeNodeProps) {
		super(GENERALDATATYPE_MODEL, props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div className="title">
					<div className="name">{this.props.node.subItptOf}</div>
				</div>
				<div className="ports">
					<div className="in">{map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

// export var GeneralDataTypeNodeWidgetFactory = createFactory(GeneralDataTypeNodeWidget);
