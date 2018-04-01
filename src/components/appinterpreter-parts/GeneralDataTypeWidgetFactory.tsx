import { GeneralDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidget";
import { GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
import { GeneralDataTypeNodeModel } from "components/appinterpreter-parts/GeneralDataTypeNodeModel";
import { NodeWidgetFactory, DiagramEngine } from "storm-react-diagrams";

export class GeneralDataTypeWidgetFactory extends NodeWidgetFactory {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: GeneralDataTypeNodeModel): JSX.Element {
		return GeneralDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
