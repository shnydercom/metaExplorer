import { DefaultPortLabel, DiagramEngine, DefaultPortModel } from "@projectstorm/react-diagrams";
import { DeclarationPartNodeModel } from "./DeclarationNodeModel";
import { map } from "lodash";
// import { DECLARATION_MODEL } from "../node-editor-consts";
import React from "react";
import { LDPortModel } from "../_super/LDPortModel";

export interface DeclarationNodeProps {
	node: DeclarationPartNodeModel;
	engine: DiagramEngine;
}

export interface DeclarationTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class DeclarationNodeWidget extends React.Component<DeclarationNodeProps, DeclarationTypeNodeState> {
	constructor(props: DeclarationNodeProps) {
		super(
			// DECLARATION_MODEL,
			props);
		this.state = {};
	}

	generatePort(port: LDPortModel) {
		return <DefaultPortLabel engine={this.props.engine} port={port as DefaultPortModel} key={port.getID()} />;
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
