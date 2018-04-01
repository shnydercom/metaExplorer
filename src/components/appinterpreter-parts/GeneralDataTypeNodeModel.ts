import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class GeneralDataTypeNodeModel extends InterpreterNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(222,222,222)") {
		super(nameSelf, subItptOf, canInterpretType, color, GENERALDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
