import { DiagramEngine, NodeWidgetFactory } from "storm-react-diagrams";
import { BaseDataTypeNodeWidgetFactory } from "./BaseDataTypeWidget";
import { BASEDATATYPE_MODEL } from "components/itpt-designer/parts/designer-consts";
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";

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
