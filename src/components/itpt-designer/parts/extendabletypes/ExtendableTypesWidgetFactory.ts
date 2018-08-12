import { DiagramEngine, AbstractNodeFactory } from "storm-react-diagrams";
import { ExtendableTypesNodeWidget } from "./ExtendableTypesNodeWidget";
import { EXTENDABLETYPES_MODEL } from "./../designer-consts";
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";
import * as React from "react";

export class ExtendableTypesWidgetFactory extends AbstractNodeFactory<ExtendableTypesNodeModel> {
	constructor() {
		super(EXTENDABLETYPES_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: ExtendableTypesNodeModel): JSX.Element {
		return React.createElement(ExtendableTypesNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}
	getNewInstance() {
		return new ExtendableTypesNodeModel();
	}
}
