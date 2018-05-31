import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './../LDPortModel';
import { ItptNodeModel } from "components/itpt-designer/parts/ItptNodeModel";
import { BASEDATATYPE_MODEL, EXTENDABLETYPES_MODEL } from "components/itpt-designer/parts/designer-consts";

export class ExtendableTypesNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		super(nameSelf, subItptOf, canInterpretType, color, EXTENDABLETYPES_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
