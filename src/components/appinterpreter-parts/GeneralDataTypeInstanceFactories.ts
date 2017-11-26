import * as SRD from "storm-react-diagrams";
import { GeneralDataTypeNodeModel } from "./GeneralDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";
import { GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class GeneralDataTypeNodeFactory extends SRD.AbstractInstanceFactory<GeneralDataTypeNodeModel> {
	constructor() {
		super(GENERALDATATYPE_MODEL);
	}

	getInstance() {
		return new GeneralDataTypeNodeModel();
	}
}
