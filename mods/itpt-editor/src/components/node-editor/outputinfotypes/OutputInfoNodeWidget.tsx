import { DefaultPortLabel, DiagramEngine } from "storm-react-diagrams";
import { OutputInfoPartNodeModel } from "./OutputInfoNodeModel";
import { Component, createFactory } from "react";
import { map } from "lodash";
import { isDemo } from "@metaexplorer/core";
import React from "react";
import { IITPTNameObj } from "../../new-itpt/newItptNodeDummy";
import { ITPTSummary } from "../../panels/ITPTSummary";

export interface OutputInfoNodeProps {
	node: OutputInfoPartNodeModel;
	diagramEngine: DiagramEngine;
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

/**
 * @author Jonathan Schneider
 */
export class OutputInfoNodeWidget_deprecated extends Component<OutputInfoNodeProps, OutputInfoTypeNodeState> {

	static getDerivedStateFromProps(nextProps: OutputInfoNodeProps, prevState: OutputInfoTypeNodeState): OutputInfoTypeNodeState | null {
		const itptName = nextProps.node.getItptName();
		const userName: string = nextProps.node.getUserName();
		const projName: string = nextProps.node.getUserProject();
		if (itptName !== prevState.stItptName
			|| userName !== prevState.userName
			|| projName !== prevState.projName
		) {
			if (itptName !== prevState.stItptName) {
				return {
					...prevState,
					blockNameInput: nextProps.node.getItptBlockName(),
					userNameInput: nextProps.node.getItptUserName(),
					userProjectInput: nextProps.node.getItptProjName(),
					stItptName: itptName, userName, projName
				};
			}
			return { ...prevState, stItptName: itptName, userName, projName };
		}
		return null;
	}

	constructor(props: OutputInfoNodeProps) {
		super(props);
		this.handleModalToggle = this.handleModalToggle.bind(this);
		this.state = {
			isModalActive: false,
			blockNameInput: props.node.getItptBlockName(),
			userNameInput: props.node.getItptUserName(),
			userProjectInput: props.node.getItptProjName(),
			stItptName: props.node.getItptName(), userName: props.node.getUserName(), projName: props.node.getUserProject()
		};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	handleModalToggle() {
		this.setState({
			...this.state,
			isModalActive: !this.state.isModalActive,
		});
	}

	generateWarningDialog(showDialog: boolean) {
		if (!showDialog) return null;
		/*const actions = [
			{ label: 'OK', primary: true, onClick: this.handleModalToggle },
		];*/
		return <div>
			Dialog
			actions=actions
			active=this.state.isModalActive
			type="small"
			title="A little reminder"
			onOverlayClick=this.handleModalToggle
			onEscKeyDown=this.handleModalToggle
			<p>Your changes won't be saved in the demo of MetaExplorer, leave us an email to get notified about our release!</p>
		</div>;
	}

	render() {
		const { node } = this.props;
		let { stItptName, blockNameInput, userProjectInput, userNameInput } = this.state;
		let canChangeItpt: boolean = !isDemo;
		let isBtnEnabled = !!blockNameInput && !!userProjectInput && !!userNameInput && node.hasMainItpt();
		const usrProj = node.getUserProject();
		const usrName = node.getUserName();
		const itptProj = node.getItptProjName();
		const itptUN = node.getItptUserName();
		let isShowInputUsrNameAndProj = !!!usrProj && !!!usrName;
		let isForeignItpt = !isShowInputUsrNameAndProj && usrName !== itptUN && usrProj !== itptProj;
		let pathPrefix: string = usrName ? usrName + "/" : null;
		if (!!pathPrefix) pathPrefix = usrProj ? pathPrefix + usrProj + "/" : pathPrefix;
		if (isForeignItpt) pathPrefix = stItptName;
		blockNameInput = !blockNameInput ? "" : blockNameInput;
		userProjectInput = !userProjectInput ? "" : userProjectInput;
		userNameInput = !userNameInput ? "" : userNameInput;
		return (
			<div className="basic-node" style={{ background: node.color }}>
				<div className="title">
					<div className="name">{node.nameSelf}</div>
				</div>
				<div className="onboarding-form ports">
					<div className="dense-form">
						<div style={{ marginLeft: "-2em" }}
							className="in">{map(node.getInPorts(), this.generatePort.bind(this))}</div>
						{isShowInputUsrNameAndProj
							? null
							: <div>{pathPrefix}</div>
						}
						{isForeignItpt
							? null
							:
							<input type='text'
								disabled={!canChangeItpt}
								name="blockNameField"
								value={blockNameInput}

								onChange={(evtVal) => {
									this.setState({ ...this.state, blockNameInput: evtVal.target.value });
								}} >{/**
						label="Block Name" */}</input>
						}
						{isShowInputUsrNameAndProj
							? <>
								{/**
									label="Project Name" */}
								<input type='text'
									disabled={!canChangeItpt}
									name="projectNameField"
									value={userProjectInput}
									onChange={(evtVal) => {
										this.setState({ ...this.state, userProjectInput: evtVal.target.value });
									}}
								/>
								{/**
									label="User Name" */}
								<input type='text'
									disabled={!canChangeItpt}
									name="userNameField"
									value={userNameInput}
									onChange={(evtVal) => {
										this.setState({ ...this.state, userNameInput: evtVal.target.value });
									}}
								/>
							</>
							: null}
					</div>
					{/**icon={!isBtnEnabled ? "warning" : "chevron_right"} */}
					<button style={{ marginTop: "0" }} disabled={!isBtnEnabled}
						onClick={() => {
							this.handleModalToggle();
							const newItptName = userNameInput + "/" + userProjectInput + "/" + blockNameInput;
							node.setItptName(newItptName);
							node.handleOutputInfoSaved();
						}} />
					{this.generateWarningDialog(!canChangeItpt)}
				</div>
			</div>
		);
	}
}

export class OutputInfoNodeWidget extends Component<OutputInfoNodeProps> {

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
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
