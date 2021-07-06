import { DefaultPortLabel, DiagramEngine, DefaultPortModel } from "@projectstorm/react-diagrams";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { map } from 'lodash';
import React from "react";
import { LDPortModel } from "../_super/LDPortModel";

export const TXT_EXPLORE = "explore";

export interface GeneralDataTypeNodeProps {
	node: GeneralDataTypeNodeModel;
	engine: DiagramEngine;
}

export interface GeneralDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class GeneralDataTypeNodeWidget extends React.Component<GeneralDataTypeNodeProps, GeneralDataTypeNodeState> {
	constructor(props: GeneralDataTypeNodeProps) {
		super(props);
		// super(GENERALDATATYPE_MODEL, props);
		this.state = {};
	}

	generatePort(port: LDPortModel) {
		return <DefaultPortLabel engine={this.props.engine} port={port as DefaultPortModel} key={port.getID()}/>;
	}

	render() {
		const className = `basic-node ${this.props.node.isSelected() ? 'selected' : ''}`;
		return (
			<div className={className} style={{ background: this.props.node.getColor() }}>
				<div className="title">
					<div className="name">{this.props.node.getSubItptOf()}</div>
				</div>
				<div className="ports">
					<div className="in">{map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
				{this.props.node.getIsCompound()
					? <button
						onClick={(ev) => this.props.node.onExploreBtnClicked()}
						className="editor-btn editor-btn-explore">
						{TXT_EXPLORE}
					</button>
					: null}
			</div>
		);
	}
}

// export var GeneralDataTypeNodeWidgetFactory = createFactory(GeneralDataTypeNodeWidget);
