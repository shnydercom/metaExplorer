import * as React from "react";
import { BaseWidgetProps, DefaultLabelModel, BaseWidget } from "@projectstorm/react-diagrams";
import { indexOf } from "lodash";
import { LDPortModel } from "../_super/LDPortModel";
export interface SettingsLabelWidgetProps extends BaseWidgetProps {
	model: DefaultLabelModel;
}

export interface SettingsLabelWidgetState {
	isVisible: boolean;
	isOpened: boolean;
	inputLinks: string[];
	outputLinks: string[];
}

export class SettingsLabelWidget extends BaseWidget<SettingsLabelWidgetProps, SettingsLabelWidgetState> {
	static getDerivedStateFromProps(nextProps: SettingsLabelWidgetProps, prevState: SettingsLabelWidgetState): SettingsLabelWidgetState | null {
		let inputLinks = [];
		let outputLinks = [];
		try {
			//sourceLinks = nextProps.model.getParent().getSourcePort().getLinks();
			const sourcePort = (nextProps.model.getParent().getSourcePort() as LDPortModel);
			if (sourcePort.in) {
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
			if (targetPort.in) {
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
		//	super("srd-default-label", props);
		super("srd-link-menu", props);
		this.state = { isVisible: false, isOpened: false, inputLinks: [], outputLinks: [] };
	}

	getInPort(): LDPortModel {
		const parentLink = this.props.model.getParent();
		if ((parentLink.getSourcePort() as LDPortModel).in) {
			return parentLink.getSourcePort() as LDPortModel;
		} else {
			return parentLink.getTargetPort() as LDPortModel;
		}
	}
	getOutPort(): LDPortModel {
		const parentLink = this.props.model.getParent();
		if (!(parentLink.getSourcePort() as LDPortModel).in) {
			return parentLink.getSourcePort() as LDPortModel;
		} else {
			return parentLink.getTargetPort() as LDPortModel;
		}
	}

	render() {
		const { isVisible, isOpened, inputLinks, outputLinks } = this.state;
		const parentLink = this.props.model.getParent();
		if (!isVisible) return null;
		const inputLinksLen = inputLinks.length;
		const outputLinksLen = outputLinks.length;
		const inputPos = indexOf(inputLinks, parentLink.id) + 1;
		const outputPos = indexOf(outputLinks, parentLink.id) + 1;
		const thisProps = this.getProps();
		return <div {...thisProps} className={isOpened ? thisProps.className + "anim" : thisProps.className}
			onMouseEnter={(event) => this.setState({ ...this.state, isOpened: true })}
			onMouseLeave={() => this.setState({ ...this.state, isOpened: false })}
		>
			{
				isOpened ?
					<div className="menu-col">
						{inputLinksLen > 1
							? <>
								<h3>input position:</h3>
								<div className="menu-row">
									<button type="button" className="btn" disabled={inputPos === 1}
										onClick={() => {
											this.getInPort().decreaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										} >&lt;</button>
									<b>{" " + inputPos + "/" + inputLinksLen + " "}</b>
									<button type="button" className="btn" disabled={inputPos === inputLinksLen}
										onClick={() => {
											this.getInPort().increaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}}>&gt;</button><br />
								</div>
							</>
							: null}
						{outputLinksLen > 1
							? <>
								<h3>output position</h3>
								<div className="menu-row">
									<button type="button" className="btn" disabled={outputPos === 1}
										onClick={() => {
											this.getOutPort().decreaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										}>&lt;</button>
									<b>{" " + outputPos + "/" + outputLinksLen + " "}</b>
									<button type="button" className="btn" disabled={outputPos === outputLinksLen}
										onClick={() => {
											this.getOutPort().increaseLinksSortOrder(parentLink);
											this.forceUpdate();
										}
										}>&gt;</button>
								</div>
							</>
							: null}
					</div>
					: null
			}
		</div>;
	}
}
