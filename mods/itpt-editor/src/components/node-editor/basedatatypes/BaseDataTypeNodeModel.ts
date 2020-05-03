import { ItptNodeModel, ItptNodeModelOptions } from "../_super/ItptNodeModel";
import { BASEDATATYPE_MODEL } from "../node-editor-consts";

export interface BaseDataTypeNodeModelOptions extends ItptNodeModelOptions {
	
}

export class BaseDataTypeNodeModel extends ItptNodeModel {

	static fromVars(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		return new this({
			nameSelf,
			subItptOf,
			canInterpretType,
			color,
			isCompound: false
		})
	}

	constructor(options: BaseDataTypeNodeModelOptions) {
		options.type = BASEDATATYPE_MODEL;
		super(options);
	}
}
