import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class BaseDataTypeNodeModel extends InterpreterNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		super(nameSelf, subItptOf, canInterpretType, color, BASEDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
