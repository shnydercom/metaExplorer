import { ItptNodeModel } from "../ItptNodeModel";
import { BASEDATATYPE_MODEL } from "../editor-consts";

export class BaseDataTypeNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		super(nameSelf, subItptOf, canInterpretType, color, BASEDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
	}
}
