import { NodeModel, AbstractInstanceFactory } from "storm-react-diagrams";
import { LDPortModel } from './LDPortModel';
import * as _ from "lodash";
import { INTERPRETERDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class InterpreterNodeModel extends NodeModel {
	nameSelf: string;
	canInterpretType: string;
	subItptOf: string;
	color: string;
	ports: { [s: string]: LDPortModel };

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", nodeType?: string, id?: string) {
		super(nodeType ? nodeType : INTERPRETERDATATYPE_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
		this.canInterpretType = canInterpretType;
		this.subItptOf = subItptOf;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.nameSelf = object.nameSelf;
		this.color = object.color;
		this.canInterpretType = object.canInterpretType;
		this.subItptOf = object.subItptOf;
	}

	serialize() {
		return _.merge(super.serialize(), {
			nameSelf: this.nameSelf,
			color: this.color,
			canInterpretType: this.canInterpretType,
			subItptOf: this.subItptOf
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
