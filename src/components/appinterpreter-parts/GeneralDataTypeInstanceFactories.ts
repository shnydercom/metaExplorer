import * as SRD from "storm-react-diagrams";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";

export class GeneralDataTypeNodeFactory extends SRD.AbstractInstanceFactory<GeneralDataTypeNodeModel> {
	constructor() {
		super("GeneralDataTypeNodeModel");
	}

	getInstance() {
		return new GeneralDataTypeNodeModel();
	}
}
