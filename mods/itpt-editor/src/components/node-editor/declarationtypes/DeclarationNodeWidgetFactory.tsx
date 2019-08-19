import { DiagramEngine, AbstractNodeFactory } from "storm-react-diagrams";
import { DeclarationNodeWidgetFactory } from "./DeclarationNodeWidget";
import { DECLARATION_MODEL } from "../node-editor-consts";
import { DeclarationPartNodeModel } from "./DeclarationNodeModel";

export class DeclarationWidgetFactory extends AbstractNodeFactory<DeclarationPartNodeModel> {
	constructor() {
		super(DECLARATION_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: DeclarationPartNodeModel): JSX.Element {
		return DeclarationNodeWidgetFactory({
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance() {
		return new DeclarationPartNodeModel();
	}
}
