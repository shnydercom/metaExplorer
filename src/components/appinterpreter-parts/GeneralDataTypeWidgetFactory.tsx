import * as SRD from "storm-react-diagrams";
import { GeneralDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidget";
import { GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class GeneralDataTypeWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.DefaultNodeModel): JSX.Element {
		return GeneralDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
