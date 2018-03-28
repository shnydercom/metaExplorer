import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { DECLARATION_MODEL } from "components/appinterpreter-parts/designer-consts";

export class DeclarationPartNodeModel extends InterpreterNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", id?: string) {
		super(nameSelf, subItptOf, canInterpretType, color, DECLARATION_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
