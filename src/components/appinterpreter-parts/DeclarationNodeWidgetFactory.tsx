import * as SRD from "storm-react-diagrams";
import { DeclarationNodeWidgetFactory } from "components/appinterpreter-parts/DeclarationNodeWidget";

export class DeclarationWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super("declarationpart");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.DefaultNodeModel): JSX.Element {
		return DeclarationNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
