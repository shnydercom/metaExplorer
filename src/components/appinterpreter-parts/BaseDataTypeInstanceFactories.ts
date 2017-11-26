import * as SRD from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "./BaseDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";
import { BASEDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";

export class BaseDataTypeNodeFactory extends SRD.AbstractInstanceFactory<BaseDataTypeNodeModel> {
	constructor() {
		super(BASEDATATYPE_MODEL);
	}

	getInstance() {
		return new BaseDataTypeNodeModel();
	}
}
