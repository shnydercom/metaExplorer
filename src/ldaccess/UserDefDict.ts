export enum UserDefDict {
	//keys
	/**
	 * the name of a component defined by a user
	 */
	outputSelfKey = "outputSelf",
	finalInputKey = "finalInput",
	externalInput = "externalInput",
	externalOutput = "externalOutput",

	//some meta data:
	projectname = "projectName",
	username = "userName",

	configItpt = "configurationBlock",

	/**
	 * if a editor-defined interpreter references another interpreter that shall _not_ be sub-instantiated in the editor-defined
	 * interpreter, a reference key to an external Interpreter is necessary
	 */
	externalReferenceKey = "externalReferenceKey",
	intrprtrBPCfgRefMapKey = "InterpreterReferenceMapKey",
	/**
	 * an outputKVMap inside of the value of a kv
	 */
	outputKVMapKey = "outputKVMapKey",

	/**
	 * in some cases, a value might exist without itself having a key. This happens for example when a wrapping LDOptions-Object only
	 * has a a single value. For this case, singleKvStore is used so that the key is referencable (by OutputKvMap for example)
	 */
	singleKvStore = "singleKvStore",

	//values
	outputItpt = "Output Info",

	//types
	/**
	 * if a kv-Store is typed with this type, then its value is another interpreter class
	 */
	intrprtrClassType = "InterpreterClassType",

	/**
	 * if a kv-Store is typed with this type, then its value is an ldTokenString on the state, i.e. a runtime-itpt
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

	itptContainerObjType = "shnyder/ContainerObjType",

	standardItptObjectTypeSuffix = "-ObjectType",

	/**
	 * in order for e.g. list elements to generate their own visuals,
	 * they need to know which data element they should access.
	 * This is like an "id" or "key" field (but those are already used in js/react)
	 */
	iteratorElementKey = "iteratorElementKey",

	/**
	 * ambiguous input data, used when doing abstract data transformation
	 */
	inputData = "inputdata",

	/**
	 * ambiguous output data, used when doing abstract data transformation
	 */
	outputData = "outputdata",
}
