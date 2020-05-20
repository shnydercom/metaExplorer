import { BaseModelOptions, DeserializeEvent, Toolkit } from "@projectstorm/react-canvas-core";
import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { filter, merge } from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "../node-editor-consts";
import { LDPortModel } from './LDPortModel';

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

export class ItptNodeModel<G extends ItptNodeModelGenerics = ItptNodeModelGenerics> extends NodeModel<G> {

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

	ports: { [s: string]: LDPortModel };

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
	}

	deSerialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.setNameSelf(event.data.nameSelf);
		this.setColor(event.data.color);
		this.setCanInterpretType(event.data.canInterpretType);
		this.setSubItptOf(event.data.subItptOf);
		this.setIsCompound(event.data.isCompound);
	}

	serialize() {
		return merge(super.serialize(), {
			nameSelf: this.getNameSelf(),
			color: this.getColor(),
			canInterpretType: this.getCanInterpretType(),
			subItptOf: this.getSubItptOf(),
			isCompound: this.getIsCompound()
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

	getNameSelf(): string {
		return this.options.nameSelf;
	}
	getCanInterpretType(): string {
		return this.options.canInterpretType;
	}
	getSubItptOf(): string {
		return this.options.subItptOf;
	}
	getColor(): string {
		return this.options.color;
	}
	getIsCompound(): boolean {
		return this.options.isCompound;
	}

	setNameSelf(val: string) {
		this.options.nameSelf = val;
	}
	setCanInterpretType(val: string) {
		this.options.canInterpretType = val;
	}
	setSubItptOf(val: string) {
		this.options.subItptOf = val;
	}
	setColor(val: string) {
		this.options.color = val;
	}
	setIsCompound(val: boolean) {
		this.options.isCompound = val;
	}
}
