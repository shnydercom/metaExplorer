import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";

export class GeneralDataTypeNodeModel extends InterpreterNodeModel {

	constructor(name: string = "Untitled", color: string = "rgb(222,222,222)") {
		super(name, color, "generaldatatype");
		this.name = name;
		this.color = color;
	}
}
