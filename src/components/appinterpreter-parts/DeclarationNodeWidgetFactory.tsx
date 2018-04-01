import { NodeWidgetFactory, DiagramEngine } from "storm-react-diagrams";
import { DeclarationNodeWidgetFactory } from "components/appinterpreter-parts/DeclarationNodeWidget";
import { DECLARATION_MODEL } from "components/appinterpreter-parts/designer-consts";
import { DeclarationPartNodeModel } from "components/appinterpreter-parts/DeclarationNodeModel";

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
