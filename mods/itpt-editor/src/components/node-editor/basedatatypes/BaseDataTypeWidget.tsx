import { DiagramEngine } from "@projectstorm/react-diagrams";
import { BaseDataTypePortSelector } from "./BaseDataTypePortSelectorWidget";
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";
import { createFactory } from "react";
import { map } from "lodash";
import React from "react";
import { LDPortModel } from "../_super/LDPortModel";

export interface BaseDataTypeNodeProps {
	node: BaseDataTypeNodeModel;
	engine: DiagramEngine;
}

export interface BaseDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class BaseDataTypeNodeWidget extends React.Component<BaseDataTypeNodeProps, BaseDataTypeNodeState> {
	constructor(props: BaseDataTypeNodeProps) {
		super(props);
		//super(BASEDATATYPE_MODEL, props);
		this.state = {};
	}

	generatePort(port: LDPortModel) {
		return <BaseDataTypePortSelector model={port} key={port.getID()} ldTokenString={port.getID()}/>;
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
