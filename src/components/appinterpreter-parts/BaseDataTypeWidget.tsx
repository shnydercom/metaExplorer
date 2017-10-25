import * as React from "react";
import * as _ from "lodash";
import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { SinglePortWidget } from './SinglePortWidget';
//import { SinglePortLabel } from "components/appinterpreter-parts/SinglePortLabelWidget";
import { BaseDataTypeDropDown } from 'components/basedatatypeinterpreter/BaseDataTypeDropDown';
import { BaseDataTypePortSelector } from "components/appinterpreter-parts/BaseDataTypePortSelectorWidget";

import {
	BooleanValInput, IntegerValInput, DoubleValInput, TextValInput, DateValInput, DateTimeValInput
} from 'components/basedatatypeinterpreter/BaseDataTypeInput';

//import { SinglePortLabel } from "components/appinterpreter-parts/SinglePortLabelWidget";

export interface BaseDataTypeNodeProps {
	node: DefaultNodeModel;
	diagramEngine: DiagramEngine;
}

export interface BaseDataTypeNodeState { }

/**
 * @author Jonathan Schneider
 */
export class BaseDataTypeNodeWidget extends React.Component<BaseDataTypeNodeProps, BaseDataTypeNodeState> {
	constructor(props: BaseDataTypeNodeProps) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		//return <DefaultPortLabel model={port} key={port.id} />;
		return <BaseDataTypePortSelector model={port} key={port.id} />;
	}

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div className="title">
					<div className="name">{this.props.node.name}</div>
				</div>
				<div className="ports">
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

export var BaseDataTypeNodeWidgetFactory = React.createFactory(BaseDataTypeNodeWidget);
