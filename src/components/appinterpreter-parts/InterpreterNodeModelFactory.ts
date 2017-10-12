import { InterpreterNodeModel } from "./InterpreterNodeModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";
export class InterpreterNodeModelFactory extends AbstractInstanceFactory<InterpreterNodeModel> {

	constructor(subModel?: string) {
		let sub: string = subModel === null ? "interpreter" : subModel; 
		super(sub);
	}

	getInstance() {
		return new InterpreterNodeModel();
	}
}
