import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";

export class BaseDataTypeNodeModel extends NodeModel {
	name: string;
	color: string;
	ports: { [s: string]: LDPortModel };

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("basedatatype");
		this.name = name;
		this.color = color;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.name = object.name;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
		});
	}

	getInPorts(): LDPortModel[] {
		return _.filter(this.ports, (portModel) => {
			return portModel.in;
		});
	}

	getOutPorts(): LDPortModel[] {
		return _.filter(this.ports, (portModel) => {
			return !portModel.in;
		});
	}
}
