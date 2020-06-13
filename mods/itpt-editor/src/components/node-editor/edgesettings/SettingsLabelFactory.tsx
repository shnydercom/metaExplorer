import * as React from "react";
import { DefaultLabelModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { SettingsLabelWidget } from "./SettingsLabelWidget";

/**
 * @author Jonathan Schneider
 */
export class SettingsLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> {
	constructor() {
		super("default");
	}

	generateReactWidget(event: GenerateWidgetEvent<DefaultLabelModel>): JSX.Element {
		return <SettingsLabelWidget model={event.model} />;
	}

	getNewInstance(initialConfig?: any): DefaultLabelModel {
		return new DefaultLabelModel();
	}
	generateModel(event): DefaultLabelModel {
		return this.getNewInstance();
	}
}
