import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class InterpreterNodeModel extends NodeModel {
	nameSelf: string;
	forType: string;
	color: string;
	ports: { [s: string]: LDPortModel };

	constructor(nameSelf: string = "Untitled", forType: string = "", color: string = "rgb(0,192,255)", nodeType?: string) {
		super(nodeType ? nodeType : INTERPRETERDATATYPE_MODEL);
		this.nameSelf = nameSelf;
		this.color = color;
		this.forType = forType;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.nameSelf = object.nameSelf;
		this.color = object.color;
		this.forType = object.forType;
	}

	serialize() {
		return _.merge(super.serialize(), {
			nameSelf: this.nameSelf,
			color: this.color,
			forType: this.forType
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
