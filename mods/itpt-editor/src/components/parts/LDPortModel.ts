import { PortModel, DiagramEngine, LinkModel, DefaultLinkModel } from "storm-react-diagrams";
import { merge } from "lodash";
import { IKvStore, isInputValueValidFor, arrayMove } from "@metaexplorer/core";
import { LD_PORTMODEL } from "./editor-consts";

/**
 * @author Dylan Vorster
 */
export class LDPortModel extends PortModel {
	in: boolean;
	label: string;
	kv: IKvStore;
	linkSortOrder: string[];

	constructor(isInput: boolean, name: string, kv: IKvStore, label: string = null, id?: string) {
		super(name, id);
		this.type = LD_PORTMODEL;
		this.in = isInput;
		this.label = label || name;
		this.kv = kv;
		this.linkSortOrder = [];
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
		this.kv = object.kv;
	}

	serialize() {
		return merge(super.serialize(), {
			in: this.in,
			label: this.label,
			kv: this.kv
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
			if (this.in === port.in) return false;
		} else {
			return false;
		}
		let ldPort = port as LDPortModel;
		if (ldPort.in) {
			rv = isInputValueValidFor(this.kv, ldPort.kv);
		} else {
			rv = isInputValueValidFor(ldPort.kv, this.kv);
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
		var idx = this.linkSortOrder.indexOf(link.id);
		if (idx > -1) {
			this.linkSortOrder.splice(idx, 1);
		}
	}

	addLink(link: LinkModel) {
		super.addLink(link);
		this.linkSortOrder.push(link.id);
	}

	decreaseLinksSortOrder(link: LinkModel) {
		const idx = this.linkSortOrder.indexOf(link.id);
		if (idx > 0) {
			arrayMove(this.linkSortOrder, idx, idx - 1);
		}
	}

	increaseLinksSortOrder(link: LinkModel) {
		const idx = this.linkSortOrder.indexOf(link.id);
		if (idx > -1 && idx <= this.linkSortOrder.length - 1) {
			arrayMove(this.linkSortOrder, idx, idx + 1);
		}
	}

	getLinksSortOrder(): string[] {
		return this.linkSortOrder;
	}
}
