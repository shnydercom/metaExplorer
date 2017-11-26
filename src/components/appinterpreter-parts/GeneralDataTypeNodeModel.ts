import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class GeneralDataTypeNodeModel extends InterpreterNodeModel {

	constructor(name: string = "Untitled", color: string = "rgb(222,222,222)") {
		super(name, color, GENERALDATATYPE_MODEL);
		this.name = name;
		this.color = color;
	}
}
