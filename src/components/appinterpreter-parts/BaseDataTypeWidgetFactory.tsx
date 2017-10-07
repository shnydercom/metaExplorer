import * as SRD from "storm-react-diagrams";
import { BaseDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidget";

export class BaseDataTypeWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super("basedatatype");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.DefaultNodeModel): JSX.Element {
		return BaseDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
