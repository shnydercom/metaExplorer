import { DiagramEngine } from "@projectstorm/react-diagrams";
import { ExtendableTypesNodeWidget } from "./ExtendableTypesNodeWidget";
import { EXTENDABLETYPES_MODEL } from "../node-editor-consts";
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";
import * as React from "react";
import { AbstractReactFactory, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";

export class ExtendableTypesWidgetFactory extends AbstractReactFactory<ExtendableTypesNodeModel, DiagramEngine> {
	constructor() {
		super(EXTENDABLETYPES_MODEL);
	}

	generateReactWidget(event: GenerateWidgetEvent<ExtendableTypesNodeModel>): JSX.Element {
		return <ExtendableTypesNodeWidget node={event.model} engine={this.engine} />
	}
	
	getNewInstance() {
		return new ExtendableTypesNodeModel();
	}

	generateModel(event): ExtendableTypesNodeModel {
		return this.getNewInstance();
	}
}
