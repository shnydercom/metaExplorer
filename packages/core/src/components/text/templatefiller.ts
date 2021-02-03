import { AbstractDataTransformer } from "../../datatransformation";
import {
	BlueprintConfig,
	//ILDOptions,
	//isObjPropertyRef,
	KVL,
	ldBlueprint,
	LDDict,
	UserDefDict,
} from "../../ldaccess";

export const TEXT_TEMPLATE = "text/template";

export const TEXT_FRAGMENT_ONE = "text/fragment-one";
export const TEXT_FRAGMENT_TWO = "text/fragment-two";

export const TEXT_FILLER_TYPE = "text/Textfiller-Type";

export const ARITHMETIC_OUTPUT_TYPE = LDDict.Text;

export const TextfillerName: string = "text/Textfiller";

export const textfillerItptKeys: string[] = [
	TEXT_TEMPLATE,
	TEXT_FRAGMENT_ONE,
	TEXT_FRAGMENT_TWO,
];
export const TextfillerOutputKVs: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: ARITHMETIC_OUTPUT_TYPE,
	},
];

const textfillerKVLs: KVL[] = [
	{
		key: TEXT_TEMPLATE,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: TEXT_FRAGMENT_ONE,
		value: undefined,
		ldType: undefined,
	},
	{
		key: TEXT_FRAGMENT_TWO,
		value: undefined,
		ldType: undefined,
	},
	...TextfillerOutputKVs,
];

let textfillerBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: TextfillerName,
	ownKVLs: textfillerKVLs,
	inKeys: textfillerItptKeys,
	canInterpretType: TEXT_FILLER_TYPE,
	crudSkills: "cRUd",
};

/***
 * replaces a {{0}} string with the first fragment, then {{1}} with the second and so forth
 */
class Textfiller extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = textfillerItptKeys;
		this.outputKvStores = TextfillerOutputKVs;
	}

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>
	): KVL[] {
		let rv = [];
		const textFragment_one = inputParams.get(TEXT_FRAGMENT_ONE);
		const textFragment_two = inputParams.get(TEXT_FRAGMENT_TWO);
		const textTemplate = inputParams.get(TEXT_TEMPLATE);
		const outputDataKV = outputKvStores.get(UserDefDict.outputData);

		let templatedString: string = textTemplate.value
			? String(textTemplate.value)
			: "";

		if (
			textTemplate &&
			textTemplate.value &&
			textFragment_one &&
			textFragment_one.value &&
			textFragment_two &&
			textFragment_two.value
		) {
			const textFrags: string[] = [
				textFragment_one.value,
				textFragment_two.value,
			];
			textFrags.forEach((val, idx) => {
				templatedString = templatedString.replaceAll(`{{${idx}}}`, val);
			});
		}

		outputDataKV.value = templatedString;
		rv = [outputDataKV];
		return rv;
	}
}

export const TextfillerBlock = ldBlueprint(textfillerBpCfg)(Textfiller);

//
