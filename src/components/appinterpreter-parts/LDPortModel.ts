import { PortModel, AbstractInstanceFactory } from "storm-react-diagrams";
import * as _ from "lodash";

/**
 * @author Dylan Vorster
 */
export class LDPortModel extends PortModel {
	in: boolean;
	label: string;

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, id);
		this.in = isInput;
		this.label = label || name;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}
}
