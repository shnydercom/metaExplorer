import { AbstractNodeFactory, DiagramEngine } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";
import { BASEDATATYPE_MODEL } from "../editor-consts";
import * as React from "react";
import { BaseDataTypeNodeWidget } from "./BaseDataTypeWidget";

export class BaseDataTypeNodeFactory extends AbstractNodeFactory<BaseDataTypeNodeModel> {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: BaseDataTypeNodeModel): JSX.Element {
		return React.createElement(BaseDataTypeNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance() {
		return new BaseDataTypeNodeModel();
	}
}
