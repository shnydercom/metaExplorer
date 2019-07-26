import { ItptNodeModel } from "../ItptNodeModel";
import { GENERALDATATYPE_MODEL } from "../editor-consts";

export class GeneralDataTypeNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(222,222,222)") {
		super(nameSelf, subItptOf, canInterpretType, color, GENERALDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
