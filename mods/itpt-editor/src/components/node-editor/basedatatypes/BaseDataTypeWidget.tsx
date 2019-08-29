import { DiagramEngine, BaseWidget, BaseWidgetProps } from "@projectstorm/react-diagrams";
import { BaseDataTypePortSelector } from "./BaseDataTypePortSelectorWidget";
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";
import { createFactory } from "react";
import { map } from "lodash";
import { BASEDATATYPE_MODEL } from "../node-editor-consts";
import React from "react";

export interface BaseDataTypeNodeProps extends BaseWidgetProps {
	node: BaseDataTypeNodeModel;
	diagramEngine: DiagramEngine;
}

export interface BaseDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class BaseDataTypeNodeWidget extends BaseWidget<BaseDataTypeNodeProps, BaseDataTypeNodeState> {
	constructor(props: BaseDataTypeNodeProps) {
		super(BASEDATATYPE_MODEL, props);
		this.state = {};
	}

	generatePort(port) {
		return <BaseDataTypePortSelector model={port} key={port.id} ldTokenString={port.id}/>;
	}

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div className="title">
					<div className="name">{this.props.node.nameSelf}</div>
				</div>
				<div className="ports">
					<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

export var BaseDataTypeNodeWidgetFactory = createFactory(BaseDataTypeNodeWidget);
