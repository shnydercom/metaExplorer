import { InterpreterNodeModel } from "./InterpreterNodeModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";
import { INTERPRETERDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
export class InterpreterNodeModelFactory extends AbstractInstanceFactory<InterpreterNodeModel> {

	constructor(subModel?: string) {
		let sub: string = subModel === null ? INTERPRETERDATATYPE_MODEL : subModel;
		super(sub);
	}

	getInstance() {
		return new InterpreterNodeModel();
	}
}
