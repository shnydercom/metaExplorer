export enum UserDefDict {
	//keys
	/**
	 * the name of a component defined by a user
	 */
	intrprtrNameKey = "InterpreterName",
	exportSelfKey = "exportSelf",
	finalInputKey = "finalInput",
	externalInput = "externalInput",

	//values
	outputInterpreter = "Output interpreter",

	//types
	/**
	 * if a kv-Store is typed with this type, then its value is another interpreter
	 */
	intrptrtType = "InterpreterType"
}
