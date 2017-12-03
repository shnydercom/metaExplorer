import * as SRD from "storm-react-diagrams";
import { BaseDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidget";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";

export class BaseDataTypeWidgetFactory extends SRD.NodeWidgetFactory {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: BaseDataTypeNodeModel): JSX.Element {
		return BaseDataTypeNodeWidgetFactory({ node: node,
			diagramEngine: diagramEngine });
	}
}
