import { ItptNodeModel, ItptNodeModelOptions, ItptNodeModelGenerics } from "../_super/ItptNodeModel";
import { GENERALDATATYPE_MODEL } from "../node-editor-consts";
import { BaseListener, BaseEvent } from "@projectstorm/react-canvas-core";
import { NodeModelGenerics } from "@projectstorm/react-diagrams";

export interface GeneralDataTypeNodeModelOptions extends ItptNodeModelOptions {

}

export interface GeneralDataTypeNodeModelListener extends BaseListener {
	onTriggerExplore?(event: BaseEvent & { itptName: null | string }): void;
}

export interface GeneralDataTypeNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: GeneralDataTypeNodeModelOptions;
	LISTENER: GeneralDataTypeNodeModelListener;
}

export class GeneralDataTypeNodeModel<G extends ItptNodeModelGenerics = ItptNodeModelGenerics> extends ItptNodeModel<G> {

	static fromVars(
		nameSelf: string = "Untitled",
		subItptOf: string = null,
		canInterpretType: string = "",
		color: string = "rgb(222,222,222)",
		isCompound?: boolean
	) {
		return new this({
			nameSelf,
			subItptOf,
			canInterpretType,
			color,
			isCompound
		});
	}

	constructor(options: GeneralDataTypeNodeModelOptions) {
		options.type = GENERALDATATYPE_MODEL;
		super(options);
	}

	onExploreBtnClicked() {
		const newItptName = this.getSubItptOf();
		this.fireEvent(
			{
				itptName: newItptName
			},
			'onTriggerExplore'
		);
	}
}
