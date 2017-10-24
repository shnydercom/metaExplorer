export enum LDDict {
	//Base data types:
	Boolean = "http://schema.org/Boolean",
	Integer = "http://schema.org/Integer",
	Double = "http://schema.org/Number",
	Text =  "http://schema.org/Text",
	Date = "http://schema.org/Date",
	DateTime = "http://schema.org/DateTime",
	//classes:
	CreateAction = "http://schema.org/CreateAction",
	ViewAction = "http://schema.org/ViewAction",
	ImageObject = "http://schema.org/ImageObject",
	EntryPoint = "http://http://schema.org/EntryPoint",
	//properties:
	target = "http://schema.org/target",
	agent = "http://schema.org/agent",
	result = "http://schema.org/result",

	//internal
	WrapperObject = "http://shnyder.com/WrapperObject"
}

export type LDDictWildCard = LDDict | string;
