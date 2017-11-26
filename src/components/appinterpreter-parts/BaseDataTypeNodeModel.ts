import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class BaseDataTypeNodeModel extends InterpreterNodeModel {

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super(name, color, BASEDATATYPE_MODEL);
		this.name = name;
		this.color = color;
	}
}
