import { DefaultPortLabel, DiagramEngine, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";
import { map } from "lodash";
import { LDPortModel } from "../_super/LDPortModel";
import { IKvStore, UserDefDict } from "@metaexplorer/core";
import { EXTENDABLETYPES_MODEL } from "../editor-consts";
import React from "react";

export interface ExtendableTypesNodeProps  extends BaseWidgetProps {
	node: ExtendableTypesNodeModel;
	diagramEngine: DiagramEngine;
}

export interface ExtendableTypesTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class ExtendableTypesNodeWidget extends BaseWidget<ExtendableTypesNodeProps, ExtendableTypesTypeNodeState> {
	constructor(props: ExtendableTypesNodeProps) {
		super(EXTENDABLETYPES_MODEL, props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
		//return <GeneralDataTypePortSelector model={port} key={port.id} />;
	}

	addInPort() {
		let len = this.props.node.getInPorts().length;
		let newPortName = "in_" + len;
		let newPortKV: IKvStore = {
			key: newPortName,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		this.props.node.addPort(new LDPortModel(true, newPortName, newPortKV));
		this.forceUpdate();
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
				{/**label="+ in"  */}
				<button className="input-highlight" onClick={this.addInPort.bind(this)} />
			</div>
		);
	}
}

// export var ExtendableTypesNodeWidgetFactory = createFactory(ExtendableTypesNodeWidget);
