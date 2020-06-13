import * as React from "react";
import { DefaultLabelModel } from "@projectstorm/react-diagrams";
import { indexOf } from "lodash";
import { LDPortModel } from "../_super/LDPortModel";
export interface SettingsLabelWidgetProps {
	model: DefaultLabelModel;
}

export interface SettingsLabelWidgetState {
	isVisible: boolean;
	isOpened: boolean;
	inputLinks: string[];
	outputLinks: string[];
}

export class SettingsLabelWidget extends React.Component<SettingsLabelWidgetProps, SettingsLabelWidgetState> {
	static getDerivedStateFromProps(nextProps: SettingsLabelWidgetProps, prevState: SettingsLabelWidgetState): SettingsLabelWidgetState | null {
		let inputLinks = [];
		let outputLinks = [];
		try {
			//sourceLinks = nextProps.model.getParent().getSourcePort().getLinks();
			const sourcePort = (nextProps.model.getParent().getSourcePort() as LDPortModel);
			if (sourcePort.isIn()) {
				inputLinks = sourcePort.getLinksSortOrder();
			} else {
				outputLinks = sourcePort.getLinksSortOrder();
			}
		} catch (ignore) {
			/** noop */
		}
		try {
			//targetLinks = nextProps.model.getParent().getTargetPort().getLinks();
			const targetPort = (nextProps.model.getParent().getTargetPort() as LDPortModel);
			if (targetPort.isIn()) {
				inputLinks = targetPort.getLinksSortOrder();
			} else {
				outputLinks = targetPort.getLinksSortOrder();
			}
		} catch (ignore) {
			/** noop */
		}
		let isVisible = false;
		if (inputLinks.length > 1 || outputLinks.length > 1) {
			isVisible = true;
		}
		return { ...prevState, isVisible, inputLinks, outputLinks };
	}

	constructor(props) {
		super(props);
		// super("srd-default-label", props);
		// super("srd-link-menu", props);
		this.state = { isVisible: false, isOpened: false, inputLinks: [], outputLinks: [] };
	}

	getDestinationPort(): LDPortModel {
		const parentLink = this.props.model.getParent();
		if ((parentLink.getSourcePort() as LDPortModel).isIn()) {
			return parentLink.getSourcePort() as LDPortModel;
		} else {
			return parentLink.getTargetPort() as LDPortModel;
		}
	}
	getOriginPort(): LDPortModel {
		const parentLink = this.props.model.getParent();
		if (!(parentLink.getSourcePort() as LDPortModel).isIn()) {
			return parentLink.getSourcePort() as LDPortModel;
		} else {
			return parentLink.getTargetPort() as LDPortModel;
		}
	}

	renderLabelMsg() {
		const inKey = this.getDestinationPort().getKV().key;
		const outKey = this.getOriginPort().getKV().key;
		return <div className="labelmsg">
			<span>{outKey}</span>
			<span>👉{inKey}</span>
		</div>;
	}

	render() {
		const { isVisible, isOpened, inputLinks, outputLinks } = this.state;
		const parentLink = this.props.model.getParent();
		if (!isVisible) return null;
		const inputLinksLen = inputLinks.length;
		const outputLinksLen = outputLinks.length;
		const inputPos = indexOf(inputLinks, parentLink.getID()) + 1;
		const outputPos = indexOf(outputLinks, parentLink.getID()) + 1;
		const destPort = this.getDestinationPort();
		if (!destPort) return null;
		const inKey = destPort.getKV().key;
		const origPort = this.getOriginPort();
		if (!origPort) return null;
		const outKey = origPort.getKV().key;
		const linkMenuClassName = "srd-link-menu";
		return <div className={isOpened ? linkMenuClassName + " anim" : linkMenuClassName}
			onMouseEnter={(event) => this.setState({ ...this.state, isOpened: true })}
			onMouseLeave={() => this.setState({ ...this.state, isOpened: false })}
		>{this.renderLabelMsg()}
			{
				isOpened ?
					<div className="menu-col">
						{outputLinksLen > 1
							? <>
								<h3>{outKey} position</h3>
								<div className="menu-row">
									<button type="button" className="btn" disabled={outputPos === 1}
										onClick={() => {
											this.getOriginPort().decreaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										}>&lt;</button>
									<b>{" " + outputPos + "/" + outputLinksLen + " "}</b>
									<button type="button" className="btn" disabled={outputPos === outputLinksLen}
										onClick={() => {
											this.getOriginPort().increaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										}>&gt;</button>
								</div>
							</>
							: null}
						{inputLinksLen > 1
							? <>
								<h3>{inKey} position:</h3>
								<div className="menu-row">
									<button type="button" className="btn" disabled={inputPos === 1}
										onClick={() => {
											this.getDestinationPort().decreaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										} >&lt;</button>
									<b>{" " + inputPos + "/" + inputLinksLen + " "}</b>
									<button type="button" className="btn" disabled={inputPos === inputLinksLen}
										onClick={() => {
											this.getDestinationPort().increaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}}>&gt;</button><br />
								</div>
							</>
							: null}
					</div>
					: null
			}
		</div>;
	}
}
