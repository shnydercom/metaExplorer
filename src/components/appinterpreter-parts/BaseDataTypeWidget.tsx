import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { SinglePortWidget } from './SinglePortWidget';
//import { SinglePortLabel } from "components/appinterpreter-parts/SinglePortLabelWidget";
import { BaseDataTypeDropDown } from 'components/basedatatypeinterpreter/BaseDataTypeDropDown';
import { BaseDataTypePortSelector } from "components/appinterpreter-parts/BaseDataTypePortSelectorWidget";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";
import { Component, createFactory, ClassAttributes, ComponentElement, ReactElement, ReactPortal } from "react";
import { map } from "lodash";
/*
import {
	BooleanValInput, IntegerValInput, DoubleValInput, TextValInput, DateValInput, DateTimeValInput
} from 'components/basedatatypeinterpreter/BaseDataTypeInput';*/

//import { SinglePortLabel } from "components/appinterpreter-parts/SinglePortLabelWidget";

export interface BaseDataTypeNodeProps {
	node: BaseDataTypeNodeModel;
	diagramEngine: DiagramEngine;
}

export interface BaseDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class BaseDataTypeNodeWidget extends Component<BaseDataTypeNodeProps, BaseDataTypeNodeState> {
	constructor(props: BaseDataTypeNodeProps) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		//return <DefaultPortLabel model={port} key={port.id} />;
		return <BaseDataTypePortSelector model={port} key={port.id} ldTokenString={port.id} outputKVMap={null}/>;
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
