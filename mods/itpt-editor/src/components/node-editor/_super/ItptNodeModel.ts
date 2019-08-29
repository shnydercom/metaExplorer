import { NodeModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { LDPortModel } from './LDPortModel';
import { merge, filter } from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "../node-editor-consts";

export class ItptNodeModel extends NodeModel {
	nameSelf: string;
	canInterpretType: string;
	subItptOf: string;
	color: string;
	ports: { [s: string]: LDPortModel };
	isCompound: boolean;

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", type?: string, id?: string, isCompound?: boolean) {
		super(type ? type : INTERPRETERDATATYPE_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
		this.canInterpretType = canInterpretType;
		this.subItptOf = subItptOf;
		this.isCompound = !!isCompound;
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.nameSelf = object.nameSelf;
		this.color = object.color;
		this.canInterpretType = object.canInterpretType;
		this.subItptOf = object.subItptOf;
		this.isCompound = object.isCompound;
	}

	serialize() {
		return merge(super.serialize(), {
			nameSelf: this.nameSelf,
			color: this.color,
			canInterpretType: this.canInterpretType,
			subItptOf: this.subItptOf,
			isCompound: this.isCompound
		});
	}

	getInPorts(): LDPortModel[] {
		return filter(this.ports, (portModel) => {
			return portModel.in;
		});
	}

	getOutPorts(): LDPortModel[] {
		return filter(this.ports, (portModel) => {
			return !portModel.in;
		});
	}
}
