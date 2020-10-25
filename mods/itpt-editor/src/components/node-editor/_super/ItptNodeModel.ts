import { BaseModelOptions, DeserializeEvent } from "@projectstorm/react-canvas-core";
import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import shortid from "shortid";
import { filter, merge } from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "../node-editor-consts";
import { LDPortModel } from './LDPortModel';
import { editorDefaultNodesColor } from "../consts";

export interface ItptNodeModelOptions extends BaseModelOptions {
	nameSelf: string;
	canInterpretType?: string;
	subItptOf?: string;
	color?: string;
	isCompound?: boolean;
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
			color: options.color ? options.color : editorDefaultNodesColor,
			canInterpretType: options.canInterpretType ? options.canInterpretType : null,
			subItptOf: options.subItptOf ? options.subItptOf : null,
			isCompound: !!options.isCompound,
			id: options.id ? options.id : shortid.generate(),
			...options
		});
		//HOTFIX: initial auto-layout doesn't know the dimensions of the nodes
		this.height = 150;
		this.width = 200;
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
