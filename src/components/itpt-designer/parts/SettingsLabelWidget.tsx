import * as React from "react";
import { BaseWidgetProps, DefaultLabelModel, BaseWidget, LinkModel } from "storm-react-diagrams";
import { FontIcon } from "react-toolbox/lib/font_icon";
import { keysIn } from "lodash";

export interface SettingsLabelWidgetProps extends BaseWidgetProps {
	model: DefaultLabelModel;
}

export interface SettingsLabelWidgetState {
	isVisible: boolean;
	isOpened: boolean;
	sourceLinks: {
		[id: string]: LinkModel;
	};
	targetLinks: {
		[id: string]: LinkModel;
	};
}

export class SettingsLabelWidget extends BaseWidget<SettingsLabelWidgetProps, SettingsLabelWidgetState> {
	static getDerivedStateFromProps(nextProps: SettingsLabelWidgetProps, prevState: SettingsLabelWidgetState): SettingsLabelWidgetState | null {
		let sourceLinks = {};
		try {
			sourceLinks = nextProps.model.getParent().getSourcePort().getLinks();
		} catch (ignore) {
			/** noop */
		}
		let targetLinks = {};
		try {
			targetLinks = nextProps.model.getParent().getTargetPort().getLinks();
		} catch (ignore) {
			/** noop */
		}
		let isVisible = false;
		if (keysIn(sourceLinks).length > 1 || keysIn(targetLinks).length > 1) {
			isVisible = true;
		}
		return { ...prevState, isVisible, sourceLinks, targetLinks };
	}

	constructor(props) {
		//	super("srd-default-label", props);
		super("srd-default-label", props);
		this.state = { isVisible: false, isOpened: false, sourceLinks: {}, targetLinks: {} };
		console.dir(props);
	}
	//
	render() {
		const { isVisible, isOpened, sourceLinks, targetLinks } = this.state;
		if (!isVisible) return null;
		return <div style={{ backgroundColor: "black", pointerEvents: "all" }}
			onMouseEnter={() => this.setState({ ...this.state, isOpened: true })}
			onMouseLeave={() => this.setState({ ...this.state, isOpened: false })}
			{...this.getProps()}
		>
			{this.props.model.label}
			{
				isOpened ?
					<div style={{ height: "100px", width: "100px" }}>
						<small>{keysIn(sourceLinks).length}</small><br/>
						<small>{keysIn(targetLinks).length}</small></div>
					:
					<FontIcon>settings</FontIcon>
			}
		</div >;
	}
}
