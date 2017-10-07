import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";

export class LDPortInstanceFactory extends AbstractInstanceFactory<LDPortModel> {
	constructor() {
		super("LDPortModel");
	}

	getInstance() {
		return new LDPortModel(true, "unknown");
	}
}
