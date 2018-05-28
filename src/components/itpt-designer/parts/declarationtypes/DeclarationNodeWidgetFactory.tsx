import { NodeWidgetFactory, DiagramEngine } from "storm-react-diagrams";
import { DeclarationNodeWidgetFactory } from "./DeclarationNodeWidget";
import { DECLARATION_MODEL } from "./../designer-consts";
import { DeclarationPartNodeModel } from "./DeclarationNodeModel";

export class DeclarationWidgetFactory extends NodeWidgetFactory {
	constructor() {
		super(DECLARATION_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: DeclarationPartNodeModel): JSX.Element {
		return DeclarationNodeWidgetFactory({
			node: node,
			diagramEngine: diagramEngine
		});
	}
}
