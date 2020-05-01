import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { GENERALDATATYPE_MODEL } from "../node-editor-consts";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { GeneralDataTypeNodeWidget } from "./GeneralDataTypeWidget";
import * as React from "react";
import { AbstractReactFactory, GenerateWidgetEvent } from "@projectstorm/react-canvas-core";

export class GeneralDataTypeNodeFactory extends AbstractReactFactory<GeneralDataTypeNodeModel, DiagramEngine> {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	getNewInstance() {
		return new GeneralDataTypeNodeModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<GeneralDataTypeNodeModel>): JSX.Element {
		return <GeneralDataTypeNodeWidget	node={event.model} engine={this.engine} />
	}
	
	generateModel(event): GeneralDataTypeNodeModel {
		return this.getNewInstance();
	}
}
