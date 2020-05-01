import { DefaultPortLabel, DiagramEngine } from "@projectstorm/react-diagrams";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { map } from 'lodash';
import React from "react";

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

	generatePort(port) {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.id}/>;
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
				{this.props.node.isCompound
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
