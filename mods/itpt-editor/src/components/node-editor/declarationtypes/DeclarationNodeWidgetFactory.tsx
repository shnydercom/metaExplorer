import { DiagramEngine } from "@projectstorm/react-diagrams";
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DeclarationNodeWidget } from "./DeclarationNodeWidget";
import { DECLARATION_MODEL } from "../node-editor-consts";
import { DeclarationPartNodeModel } from "./DeclarationNodeModel";
import React from "react";

export class DeclarationWidgetFactory extends AbstractReactFactory<DeclarationPartNodeModel, DiagramEngine> {
	constructor() {
		super(DECLARATION_MODEL);
	}

	generateReactWidget(event: GenerateWidgetEvent<DeclarationPartNodeModel>): JSX.Element {
		return <DeclarationNodeWidget engine={this.engine} node={event.model} />
	}

	generateModel(event): DeclarationPartNodeModel {
		return this.getNewInstance();
	}

	getNewInstance() {
		return new DeclarationPartNodeModel();
	}
}
