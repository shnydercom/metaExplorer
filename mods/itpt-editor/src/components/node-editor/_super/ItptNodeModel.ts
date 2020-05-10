import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { LDPortModel } from './LDPortModel';
import { merge, filter } from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "../node-editor-consts";
import { BaseModelOptions, DeserializeEvent, Toolkit } from "@projectstorm/react-canvas-core";

export interface ItptNodeModelOptions extends BaseModelOptions {
	nameSelf: string;
	canInterpretType: string;
	subItptOf: string;
	color: string;
	isCompound: boolean;
}

export interface ItptNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: ItptNodeModelOptions;
}

export class ItptNodeModel extends NodeModel<ItptNodeModelGenerics> {

	static fromVars(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", isCompound?: boolean, type?: string) {
		return new this({
			nameSelf,
			subItptOf,
			canInterpretType,
			color,
			type,
			isCompound
		}
		);
	}

	nameSelf: string;
	canInterpretType: string;
	subItptOf: string;
	color: string;
	ports: { [s: string]: LDPortModel };
	isCompound: boolean;

	constructor(options: ItptNodeModelOptions) {
		// nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", type?: string, id?: string, isCompound?: boolean) {
		super({
			type: options.type ? options.type : INTERPRETERDATATYPE_MODEL,
			nameSelf: options.nameSelf,
			color: options.color,
			canInterpretType: options.canInterpretType,
			subItptOf: options.subItptOf,
			isCompound: !!options.isCompound,
			id: options.id ? options.id : Toolkit.UID(),
			...options
		});
		/*
		type ? type : INTERPRETERDATATYPE_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
		this.canInterpretType = canInterpretType;
		this.subItptOf = subItptOf;
		this.isCompound = !!isCompound;
		*/
	}

	deSerialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.nameSelf = event.data.nameSelf;
		this.color = event.data.color;
		this.canInterpretType = event.data.canInterpretType;
		this.subItptOf = event.data.subItptOf;
		this.isCompound = event.data.isCompound;
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
		return filter(this.ports, (portModel: LDPortModel) => {
			return portModel.isIn();
		});
	}

	getOutPorts(): LDPortModel[] {
		return filter(this.ports, (portModel: LDPortModel) => {
			return !portModel.isIn();
		});
	}
}
