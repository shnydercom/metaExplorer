import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";

export class BaseDataTypeNodeModel extends InterpreterNodeModel {

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color, "basedatatype");
		this.name = name;
		this.color = color;
	}
}
