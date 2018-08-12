import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { LDPortModel } from "./../LDPortModel";
import { GENERALDATATYPE_MODEL } from "./../designer-consts";
import { AbstractNodeFactory, DiagramEngine } from "storm-react-diagrams";
import { GeneralDataTypeNodeWidget } from "./GeneralDataTypeWidget";
import * as React from "react";

export class GeneralDataTypeNodeFactory extends AbstractNodeFactory<GeneralDataTypeNodeModel> {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	getNewInstance() {
		return new GeneralDataTypeNodeModel();
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: GeneralDataTypeNodeModel): JSX.Element {
		return React.createElement(GeneralDataTypeNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}
}
