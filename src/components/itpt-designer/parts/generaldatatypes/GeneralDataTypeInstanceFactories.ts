import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { LDPortModel } from "./../LDPortModel";
import { GENERALDATATYPE_MODEL } from "./../designer-consts";
import { AbstractInstanceFactory } from "storm-react-diagrams/dist/src/main";

export class GeneralDataTypeNodeFactory extends AbstractInstanceFactory<GeneralDataTypeNodeModel> {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	getInstance() {
		return new GeneralDataTypeNodeModel();
	}
}
