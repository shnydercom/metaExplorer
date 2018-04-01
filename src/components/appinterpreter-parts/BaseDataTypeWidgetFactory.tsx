import { DiagramEngine, NodeWidgetFactory } from "storm-react-diagrams";
import { BaseDataTypeNodeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidget";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";

export class BaseDataTypeWidgetFactory extends NodeWidgetFactory {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: BaseDataTypeNodeModel): JSX.Element {
		return BaseDataTypeNodeWidgetFactory({
			node: node,
			diagramEngine: diagramEngine
		});
	}
}
