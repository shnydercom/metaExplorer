import { PortModel, AbstractInstanceFactory } from "storm-react-diagrams";
import * as _ from "lodash";
import { IKvStore } from "ldaccess/ikvstore";

/**
 * @author Dylan Vorster
 */
export class LDPortModel extends PortModel {
	in: boolean;
	label: string;
	kv: IKvStore;

	constructor(isInput: boolean, name: string, kv: IKvStore, label: string = null, id?: string) {
		super(name, id);
		this.in = isInput;
		this.label = label || name;
		this.kv = kv;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.in = object.in;
		this.label = object.label;
		this.kv = object.kv;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label,
			kv: this.kv
		});
	}
}
