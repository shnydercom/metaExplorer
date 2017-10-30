import * as SRD from "storm-react-diagrams";
import { GeneralDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidget";

export class GeneralDataTypeWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super("generaldatatype");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.DefaultNodeModel): JSX.Element {
		return GeneralDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
