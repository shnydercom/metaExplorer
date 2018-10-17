import { PortModel, DiagramEngine, LinkModel, DefaultPortModel, DefaultLinkModel } from "storm-react-diagrams";
import { merge } from "lodash";
import { IKvStore } from "ldaccess/ikvstore";
import { LD_PORTMODEL } from "./designer-consts";
import { isInputValueValidFor } from "ldaccess/ldtypesystem/typeChecking";

/**
 * @author Dylan Vorster
 */
export class LDPortModel extends PortModel {
	in: boolean;
	label: string;
	kv: IKvStore;

	constructor(isInput: boolean, name: string, kv: IKvStore, label: string = null, id?: string) {
		super(name, id);
		this.type = LD_PORTMODEL;
		this.in = isInput;
		this.label = label || name;
		this.kv = kv;
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
		return link || new DefaultLinkModel();
	}
}
