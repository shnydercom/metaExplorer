import { PortModel, LinkModel, DefaultLinkModel, PortModelOptions, PortModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { merge } from "lodash";
import { IKvStore, isInputValueValidFor, arrayMove } from "@metaexplorer/core";
import { LD_PORTMODEL } from "../node-editor-consts";
import { DeserializeEvent } from "@projectstorm/react-canvas-core";

export interface LDPortModelOptions extends PortModelOptions {
	in: boolean;
	label?: string;
	kv: IKvStore;
	linkSortOrder?: string[];
}

export interface LDPortModelGenerics extends PortModelGenerics {
	OPTIONS: LDPortModelOptions;
}

/**
 * @author Jonathan Schneider
 */
export class LDPortModel extends PortModel<LDPortModelGenerics> {

	static fromVars(isInput: boolean, name: string, kv: IKvStore, label: string = null, id?: string) {
		return new this({
			in: isInput,
			name,
			kv,
			label,
			id
		});
	}
	constructor(options: LDPortModelOptions) {
		super({
			alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
			type: LD_PORTMODEL,
			linkSortOrder: [],
			...options
		});
	}

	deSerialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		//object, engine);
		this.options.in = event.data.in;
		this.options.label = event.data.label;
		this.options.kv = event.data.kv;
	}

	serialize() {
		return merge(super.serialize(), {
			in: this.options.in,
			label: this.options.label,
			kv: this.options.kv
		});
	}

	link(port: PortModel): LinkModel {
		let link = this.createLinkModel();
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		let rv: boolean = true;
		if (port instanceof LDPortModel) {
			if (this.options.in === port.options.in) return false;
		} else {
			return false;
		}
		let ldPort = port as LDPortModel;
		if (ldPort.options.in) {
			rv = isInputValueValidFor(this.options.kv, ldPort.options.kv);
		} else {
			rv = isInputValueValidFor(ldPort.options.kv, this.options.kv);
		}
		return rv;
	}

	createLinkModel(): LinkModel {
		let link = super.createLinkModel();
		if (link) return link;
		let defaultLink = new DefaultLinkModel();
		defaultLink.addLabel("");
		return defaultLink;
	}

	removeLink(link: LinkModel) {
		super.removeLink(link);
		var idx = this.options.linkSortOrder.indexOf(link.getID());
		if (idx > -1) {
			this.options.linkSortOrder.splice(idx, 1);
		}
	}

	addLink(link: LinkModel) {
		super.addLink(link);
		this.options.linkSortOrder.push(link.getID());
	}

	decreaseLinksSortOrder(link: LinkModel) {
		const idx = this.options.linkSortOrder.indexOf(link.getID());
		if (idx > 0) {
			arrayMove(this.options.linkSortOrder, idx, idx - 1);
		}
	}

	increaseLinksSortOrder(link: LinkModel) {
		const idx = this.options.linkSortOrder.indexOf(link.getID());
		if (idx > -1 && idx <= this.options.linkSortOrder.length - 1) {
			arrayMove(this.options.linkSortOrder, idx, idx + 1);
		}
	}

	getLinksSortOrder(): string[] {
		return this.options.linkSortOrder;
	}

	setKV(kv: IKvStore): void {
		this.options.kv = kv;
	}

	getKV(): IKvStore {
		return this.options.kv;
	}

	isIn(): boolean {
		return this.options.in;
	}

	getLabel(): string | undefined{
		return this.options.label;
	}
}
