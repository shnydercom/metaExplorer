import { DefaultNodeModel, DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import Dropdown from 'react-toolbox/lib/dropdown';
import { OutputInfoPartNodeModel } from "./OutputInfoNodeModel";
import { Component, createFactory, ClassAttributes, ComponentElement, ReactElement, ReactPortal } from "react";
import { map } from "lodash";
import { IconButton } from "react-toolbox/lib/button";
import { Input } from "react-toolbox/lib/input";

export interface OutputInfoNodeProps {
	node: OutputInfoPartNodeModel;
	diagramEngine: DiagramEngine;
}

export interface OutputInfoTypeNodeState {
	stItptName: string;
}

/**
 * @author Jonathan Schneider
 */
export class OutputInfoNodeWidget extends Component<OutputInfoNodeProps, OutputInfoTypeNodeState> {

	static getDerivedStateFromProps(nextProps, prevState) {
		const itptName = nextProps.node.getItptName();
		if (itptName !== prevState.stItptName) {
			return { stItptName: itptName};
		}
		return null;
	}

	constructor(props: OutputInfoNodeProps) {
		super(props);
		this.state = { stItptName: props.node.getItptName() };
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	render() {
		const { node } = this.props;
		const { stItptName } = this.state;
		let itptName = stItptName ? stItptName : "";
		let isBtnEnabled = !!itptName && node.hasMainItpt();
		return (
			<div className="basic-node" style={{ background: node.color }}>
				<div className="title">
					<div className="name">{node.nameSelf}</div>
				</div>
				<div className="onboarding-form ports">
					<div className="dense-form">
						<div style={{ marginLeft: "-2em" }}
							className="in">{map(node.getInPorts(), this.generatePort.bind(this))}</div>
						<Input type='text'
							label="Block Name"
							name="blockNameField"
							value={itptName}

							onChange={(evtVal) => {
								node.setItptName(evtVal);
								this.setState({ stItptName: evtVal });
							}} />
					</div>
					<IconButton style={{ marginTop: "0" }} disabled={!isBtnEnabled}
						icon={!isBtnEnabled ? "warning" : "chevron_right"} onClick={() => node.handleOutputInfoSaved()} />
				</div>
			</div>
		);
	}
}
//<div className="out">{map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>

export var OutputInfoNodeWidgetFactory = createFactory(OutputInfoNodeWidget);
