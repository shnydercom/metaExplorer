import { DiagramEngine } from "@projectstorm/react-diagrams";
import { OutputInfoNodeWidgetFactory } from "./OutputInfoNodeWidget";
import { OUTPUT_INFO_MODEL } from "../node-editor-consts";
import { OutputInfoPartNodeModel } from "./OutputInfoNodeModel";
import { AbstractReactFactory, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";
import React from "react";

export class OutputInfoWidgetFactory extends AbstractReactFactory<OutputInfoPartNodeModel, DiagramEngine> {
	constructor() {
		super(OUTPUT_INFO_MODEL);
	}

	generateReactWidget(event: GenerateWidgetEvent<OutputInfoPartNodeModel>): JSX.Element {
		return <OutputInfoNodeWidgetFactory node={event.model} engine={this.engine} />
	}

	generateModel(event): OutputInfoPartNodeModel {
		return this.getNewInstance();
	}

	getNewInstance() {
		return new OutputInfoPartNodeModel();
	}
}
