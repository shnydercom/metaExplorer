import { ItptNodeModel, ItptNodeModelOptions } from "../_super/ItptNodeModel";
import { EXTENDABLETYPES_MODEL } from "../node-editor-consts";
import { editorSpecificNodesColor } from "../consts";

export interface ExtendableTypesNodeModelOptions extends ItptNodeModelOptions {

}

export class ExtendableTypesNodeModel extends ItptNodeModel {

	static fromVars(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)") {
		return new this({
			nameSelf,
			subItptOf,
			canInterpretType,
			color,
			isCompound: false
		});
	}

	constructor(options: ExtendableTypesNodeModelOptions) {
		options.type = EXTENDABLETYPES_MODEL;
		options.color = options.color ? options.color : editorSpecificNodesColor;
		super(options);
	}
}
