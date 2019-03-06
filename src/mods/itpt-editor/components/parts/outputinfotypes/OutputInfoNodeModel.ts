import { BaseEvent, BaseModelListener, DiagramEngine } from "storm-react-diagrams";
import { OUTPUT_INFO_MODEL } from "../editor-consts";
import { ItptNodeModel } from "../ItptNodeModel";
import { merge } from "lodash";

export interface OutputInfoNodeModelListener extends BaseModelListener {
	outputInfoSaved?(event: BaseEvent<OutputInfoPartNodeModel> & { itptName: null | string }): void;
}

export class OutputInfoPartNodeModel extends ItptNodeModel {

	protected itptName: string | null;

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", id?: string) {
		super(nameSelf, subItptOf, canInterpretType, color, OUTPUT_INFO_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
		this.itptName = null;
		this.width = 600;
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.itptName = object.itptName;
	}

	serialize() {
		return merge(super.serialize(), {
			itptName: this.itptName
		});
	}

	setItptName(value: string) {
		this.itptName = value;
	}
	getItptName() {
		return this.itptName;
	}

	public setSelected(selected: boolean = true) {
		//catching this event on purpose, if
	}

	hasMainItpt(): boolean {
		const inP = this.getInPorts();
		if (inP.length > 0) {
			const links = inP[0].getLinks();
			let elemCounter = 0;
			for (const key in links) {
				if (links.hasOwnProperty(key)) {
					elemCounter++;
					const element = links[key];
					if (!element.sourcePort || !element.targetPort) return false;
				}
			}
			if (elemCounter !== 1) return false;
		}
		return true;
	}

	handleOutputInfoSaved() {
		const newItptName = this.itptName;
		this.iterateListeners((listener: OutputInfoNodeModelListener, event: BaseEvent<OutputInfoPartNodeModel> & { itptName: null | string }) => {
			if (listener.outputInfoSaved) {
				listener.outputInfoSaved({ ...event, itptName: newItptName });
			}
		});
	}
}
