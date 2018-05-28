import { ItptNodeModel } from "./ItptNodeModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";
import { INTERPRETERDATATYPE_MODEL } from "./designer-consts";
export class ItptNodeModelFactory extends AbstractInstanceFactory<ItptNodeModel> {

	constructor(subModel?: string) {
		let sub: string = subModel === null ? INTERPRETERDATATYPE_MODEL : subModel;
		super(sub);
	}

	getInstance() {
		return new ItptNodeModel();
	}
}
