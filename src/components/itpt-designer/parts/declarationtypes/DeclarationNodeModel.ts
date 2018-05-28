import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './../LDPortModel';
import { ItptNodeModel } from "./../ItptNodeModel";
import { DECLARATION_MODEL } from "./../designer-consts";

export class DeclarationPartNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", id?: string) {
		super(nameSelf, subItptOf, canInterpretType, color, DECLARATION_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
