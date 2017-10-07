import { InterpreterNodeModel } from "./InterpreterNodeModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";
export class InterpreterNodeModelFactory extends AbstractInstanceFactory<InterpreterNodeModel> {
	constructor() {
		super("interpreter");
	}

	getInstance() {
		return new InterpreterNodeModel();
	}
}
