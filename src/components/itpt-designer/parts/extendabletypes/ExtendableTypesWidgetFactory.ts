import { NodeWidgetFactory, DiagramEngine } from "storm-react-diagrams";
import { ExtendableTypesNodeWidgetFactory } from "./ExtendableTypesNodeWidget";
import { EXTENDABLETYPES_MODEL } from "./../designer-consts";
import { ExtendableTypesNodeModel } from "./ExtendableTypesNodeModel";

export class ExtendableTypesWidgetFactory extends NodeWidgetFactory {
	constructor() {
		super(EXTENDABLETYPES_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: ExtendableTypesNodeModel): JSX.Element {
		return ExtendableTypesNodeWidgetFactory({
			node: node,
			diagramEngine: diagramEngine
		});
	}
}
