export enum UserDefDict {
	//keys
	/**
	 * the name of a component defined by a user
	 */
	intrprtrNameKey = "InterpreterName",
	exportSelfKey = "exportSelf",
	finalInputKey = "finalInput",
	externalInput = "externalInput",
	intrprtrBPCfgRefMapKey = "InterpreterReferenceMapKey",

	//values
	outputInterpreter = "Output interpreter",

	//types
	/**
	 * if a kv-Store is typed with this type, then its value is another interpreter
	 */
	intrptrtType = "InterpreterType",
	/**
	 * if a kv-Store is typed with this type, then its value is a map containing Ld-Blueprint-Configs. This is useful,
	 * because an interpreter is rarely defined as a perfect tree. Referencing between branches needs to be possible
	 * (as in a DAG). E.g.: One interpreter (a) gets an image from an image service (b), which image that is depends on
	 * another data service (c). (a) wants to display data and the image, so it references both (b and c), while (b)
	 * only references (c). In the node-editor, no ports with this type should appear, as it is only necessary for
	 * serialization
	 */
	intrprtrBPCfgRefMapType = "InterpreterReferenceMapType",

	standardInterpreterObjectTypeSuffix = "-ObjectType"
}
