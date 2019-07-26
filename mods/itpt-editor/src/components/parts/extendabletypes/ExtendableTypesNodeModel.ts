import { ItptNodeModel } from "../ItptNodeModel";
import { EXTENDABLETYPES_MODEL } from "../editor-consts";

export class ExtendableTypesNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		super(nameSelf, subItptOf, canInterpretType, color, EXTENDABLETYPES_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
