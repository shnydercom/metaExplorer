import { GeneralDataTypeNodeWidgetFactory } from "./GeneralDataTypeWidget";
import { GENERALDATATYPE_MODEL } from "./../designer-consts";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
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
