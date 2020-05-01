import { DiagramEngine } from "@projectstorm/react-diagrams";
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";
import { BASEDATATYPE_MODEL } from "../node-editor-consts";
import * as React from "react";
import { BaseDataTypeNodeWidget } from "./BaseDataTypeWidget";

export class BaseDataTypeNodeFactory extends AbstractReactFactory<BaseDataTypeNodeModel, DiagramEngine> {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	generateReactWidget(event): JSX.Element {
		return <BaseDataTypeNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event) {
		return new BaseDataTypeNodeModel();
	}
}
