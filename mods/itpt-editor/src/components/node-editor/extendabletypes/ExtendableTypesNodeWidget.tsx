import { DefaultPortLabel, DiagramEngine, DefaultPortModel } from "@projectstorm/react-diagrams";
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";
import { map } from "lodash";
import { LDPortModel } from "../_super/LDPortModel";
import { KVL, UserDefDict } from "@metaexplorer/core";
import React from "react";

export const TXT_ADD_PORT = "+1 in";

export interface ExtendableTypesNodeProps {
	node: ExtendableTypesNodeModel;
	engine: DiagramEngine;
}

export interface ExtendableTypesTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class ExtendableTypesNodeWidget extends React.Component<ExtendableTypesNodeProps, ExtendableTypesTypeNodeState> {
	constructor(props: ExtendableTypesNodeProps) {
		super(props);
		//super(EXTENDABLETYPES_MODEL, props);
		this.state = {};
	}

	generatePort(port: LDPortModel) {
		return <DefaultPortLabel engine={this.props.engine} port={port as DefaultPortModel} key={port.getID()} />;
		//return <GeneralDataTypePortSelector model={port} key={port.id} />;
	}

	addInPort() {
		let len = this.props.node.getInPorts().length;
		let newPortName = "in_" + len;
		let newPortKV: KVL = {
			key: newPortName,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		this.props.node.addPort(new LDPortModel({
			in: true,
			name: newPortName,
			kv: newPortKV,
			id: newPortName,
			label: newPortName
		}));
		this.forceUpdate();
	}

	render() {
		const className = `basic-node ${this.props.node.isSelected() ? 'selected' : ''}`;
		return (
			<div className={className} style={{ background: this.props.node.getColor() }}>
				<div className="title">
					<div className="name">{this.props.node.getNameSelf()}</div>
				</div>
				<div className="ports">
					<div className="in">{map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
				<button className="editor-btn editor-btn-addport input-highlight" onClick={this.addInPort.bind(this)} >{TXT_ADD_PORT}</button>
			</div>
		);
	}
}

// export var ExtendableTypesNodeWidgetFactory = createFactory(ExtendableTypesNodeWidget);
