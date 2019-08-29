import { ItptNodeModel } from "../_super/ItptNodeModel";
import { GENERALDATATYPE_MODEL } from "../node-editor-consts";
import { BaseEvent, BaseModelListener } from "@projectstorm/react-diagrams";

export interface GeneralDataTypeNodeModelListener extends BaseModelListener {
	onTriggerExplore?(event: BaseEvent<GeneralDataTypeNodeModel> & { itptName: null | string }): void;
}

export class GeneralDataTypeNodeModel extends ItptNodeModel {

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(222,222,222)", isCompound: boolean = false) {
		super(nameSelf, subItptOf, canInterpretType, color, GENERALDATATYPE_MODEL, undefined, isCompound);
		this.nameSelf = nameSelf;
		this.color = color;
	}

	onExploreBtnClicked() {
		const newItptName = this.subItptOf;
		this.iterateListeners((listener: GeneralDataTypeNodeModelListener, event: BaseEvent<GeneralDataTypeNodeModel> & { itptName: null | string }) => {
			if (listener.onTriggerExplore) {
				listener.onTriggerExplore({ ...event, itptName: newItptName });
			}
		});
	}
}
