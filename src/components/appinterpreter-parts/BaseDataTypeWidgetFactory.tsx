import * as SRD from "storm-react-diagrams";
import { BaseDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidget";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class BaseDataTypeWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: SRD.DefaultNodeModel): JSX.Element {
		return BaseDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
