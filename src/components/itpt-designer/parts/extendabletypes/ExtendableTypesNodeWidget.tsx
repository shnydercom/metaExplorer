import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";
import { Component, createFactory, ClassAttributes, ComponentElement, ReactElement, ReactPortal } from "react";
import { map } from "lodash";
import { Button } from "react-toolbox/lib/button";
import { LDPortModel } from "../LDPortModel";
import { IKvStore } from "ldaccess/ikvstore";
import { UserDefDict } from "ldaccess/UserDefDict";

export interface ExtendableTypesNodeProps {
	node: ExtendableTypesNodeModel;
	diagramEngine: DiagramEngine;
}

export interface ExtendableTypesTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class ExtendableTypesNodeWidget extends Component<ExtendableTypesNodeProps, ExtendableTypesTypeNodeState> {
	constructor(props: ExtendableTypesNodeProps) {
		super(props);
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
				<Button label="+ in" onClick={this.addInPort.bind(this)} />
			</div>
		);
	}
}

export var ExtendableTypesNodeWidgetFactory = createFactory(ExtendableTypesNodeWidget);
