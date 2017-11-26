import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { DECLARATION_MODEL } from "components/appinterpreter-parts/designer-consts";

export class DeclarationPartNodeModel extends InterpreterNodeModel {

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color, DECLARATION_MODEL);
		this.name = name;
		this.color = color;
	}
}
