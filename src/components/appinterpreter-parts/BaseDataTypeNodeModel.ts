import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class BaseDataTypeNodeModel extends InterpreterNodeModel {

	constructor(nameSelf: string = "Untitled", forType: string = "", color: string = "rgb(0,192,255)") {
		super(nameSelf, forType, color, BASEDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
