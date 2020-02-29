export enum LDDict {
	//Base data types:
	Boolean = "http://schema.org/Boolean",
	Integer = "http://schema.org/Integer",
	Double = "http://schema.org/Number",
	Text =  "http://schema.org/Text",
	Date = "http://schema.org/Date",
	DateTime = "http://schema.org/DateTime",
	//classes:
	Action = "https://schema.org/Action",
	CreateAction = "http://schema.org/CreateAction",
	ViewAction = "http://schema.org/ViewAction",
	ChooseAction = "http://schema.org/ChooseAction",
	ImageObject = "http://schema.org/ImageObject",
	VideoObject = "https://schema.org/VideoObject",
	AudioObject = "http://schema.org/AudioObject",
	EntryPoint = "http://http://schema.org/EntryPoint",
	Organization = "http://schema.org/Organization",
	URL = "https://schema.org/URL",
	//properties:
	address = "http://schema.org/address",
	target = "http://schema.org/target",
	agent = "http://schema.org/agent",
	result = "http://schema.org/result",
	contentUrl = "http://schema.org/contentUrl",
	name = "http://schema.org/name",
	fileFormat = "http://schema.org/fileFormat",
	manufacturer = "http://schema.org/manufacturer",
	description = "http://schema.org/description",
	image = "http://schema.org/image",
	gtin8 = "http://schema.org/gtin8",
	object = "http://schema.org/object",
	actionOption = "http://schema.org/actionOption",

	email = "http://schema.org/email",
	embedUrl = "https://schema.org/embedUrl",
}

export type LDDictWildCard = LDDict | string;
