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
	/**
	 * an outputKVMap inside of the value of a kv
	 */
	outputKVMapKey = "outputKVMapKey",

	//values
	outputInterpreter = "Output interpreter",

	//types
	/**
	 * if a kv-Store is typed with this type, then its value is another interpreter class
	 */
	intrprtrClassType = "InterpreterClassType",

	/**
	 * if a kv-Store is typed with this type, then its value is an ldTokenString, the intrprtrClass is filled
	 */
	intrprtrObjectType = "InterpreterObjectType",

	/**
	 * if a kv-store is type with this type, then its value is a reference key to the store (i.e. application state)
	 */
	ldTokenStringReference = "ldTkStrRef",

	/**
	 * an outputKVMap inside of the value of a kv
	 */
	outputKVMapType = "outputKVMapType",

	/**
	 * if a kv-Store is typed with this type, then its value is a map containing Ld-Blueprint-Configs. This is useful,
	 * because an interpreter is rarely defined as a perfect tree. Referencing between branches needs to be possible
	 * (as in a DAG). E.g.: One interpreter (a) gets an image from an image service (b), which image that is depends on
	 * another data service (c). (a) wants to display data and the image, so it references both (b and c), while (b)
	 * only references (c). In the node-editor, no ports with this type should appear, as it is only necessary for
	 * serialization
	 */
	intrprtrBPCfgRefMapType = "InterpreterReferenceMapType",
	intrprtrBPCfgRefMapName = "shnyder/RefMapInterpreter",

	standardInterpreterObjectTypeSuffix = "-ObjectType"
}
