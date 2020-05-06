import { DefaultPortLabel, DiagramEngine, DefaultPortModel } from "@projectstorm/react-diagrams";
import { OutputInfoPartNodeModel } from "./OutputInfoNodeModel";
import { Component, createFactory } from "react";
import { map } from "lodash";
import React from "react";
import { IITPTNameObj } from "../../new-itpt/newItptNodeDummy";
import { ITPTSummary } from "../../panels/ITPTSummary";
import { LDPortModel } from "../_super/LDPortModel";

export interface OutputInfoNodeProps {
	node: OutputInfoPartNodeModel;
	engine: DiagramEngine;
}

export interface OutputInfoTypeNodeState {
	stItptName: string;
	blockNameInput: string;
	userNameInput: string;
	userProjectInput: string;
	userName: string;
	projName: string;
	isModalActive: boolean;
}

export class OutputInfoNodeWidget extends Component<OutputInfoNodeProps> {

	generatePort(port: LDPortModel) {
		return <DefaultPortLabel engine={this.props.engine} port={port as DefaultPortModel} key={port.getID()}/>;
	}

	render() {
		const { node } = this.props;
		//const usrProj = node.getUserProject();
		//const usrName = node.getUserName();
		const projectName = node.getItptProjName();
		const userName = node.getItptUserName();
		const blockName = node.getItptBlockName();
		const nameObj: IITPTNameObj = {
			blockName,
			concatTitle: '',
			projectName,
			userName
		}
		return (
			<div className="basic-node" style={{ background: node.color }}>
				<div className="title">
					<div className="name">{node.nameSelf}</div>
				</div>
				<div className="onboarding-form ports">
					<div className="dense-form">
						<div style={{ marginLeft: "-2em" }}
							className="in">{map(node.getInPorts(), this.generatePort.bind(this))}</div>
							<ITPTSummary {...nameObj}/>
					</div>
				</div>
			</div>
		);
	}
}

export var OutputInfoNodeWidgetFactory = createFactory(OutputInfoNodeWidget);
