import { AbstractDataTransformer } from "../../datatransformation";
import {
	BlueprintConfig,
	ILDOptions,
	isObjPropertyRef,
	KVL,
	ldBlueprint,
	LDDict,
	UserDefDict,
} from "../../ldaccess";

export const TEXT_TEMPLATE = "text/template";

export const TEXT_FRAGMENTS = "text/fragments";

export const TEXT_FILLER_TYPE = "text/Textfiller-Type";

export const ARITHMETIC_OUTPUT_TYPE = LDDict.Text;

export const TextfillerName: string = "text/Textfiller";

export const textfillerItptKeys: string[] = [TEXT_TEMPLATE, TEXT_FRAGMENTS];
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
		key: TEXT_FRAGMENTS,
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

	private textFragments: KVL = {
		key: TEXT_FRAGMENTS,
		value: [],
		ldType: undefined,
	};

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores)
			return;
		this.ldTkStr = ldOptions.ldToken.get();
		let kvs = ldOptions.resource.kvStores;
		let outputKVMap: KVL = kvs.find(
			(val) => UserDefDict.outputKVMapKey === val.key
		);
		outputKVMap = outputKVMap
			? outputKVMap
			: this.cfg.ownKVLs.find(
					(val) => UserDefDict.outputKVMapKey === val.key
			  );
		this.setOutputKVMap(
			outputKVMap && outputKVMap.value
				? outputKVMap.value
				: this.outputKVMap
		);

		this.textFragments = {
			key: TEXT_FRAGMENTS,
			value: [],
			ldType: undefined,
		};
		for (let inputidx = 0; inputidx < this.itptKeys.length; inputidx++) {
			const inputKey = this.itptKeys[inputidx];
			let param = kvs.find(
				(val) => val.key === inputKey && !isObjPropertyRef(val.value)
			);
			if (
				param &&
				param.value !== null &&
				JSON.stringify(param) !==
					JSON.stringify(this.inputParams.get(inputKey))
			) {
				if (inputKey === TEXT_FRAGMENTS) {
					(this.textFragments.value as Array<string>).push(
						param.value
					);
					debugger;
					//this.isInputDirty = true;
				} else {
					this.inputParams.set(inputKey, param);
					this.isInputDirty = true;
				}
			}
		}
		this.evalDirtyInput();
		this.evalDirtyOutput();
	};

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>
	): KVL[] {
		let rv = [];
		const textFragments = this.textFragments;
		const textTemplate = inputParams.get(TEXT_TEMPLATE);
		const outputDataKV = outputKvStores.get(UserDefDict.outputData);

		let templatedString: string = textTemplate.value ? String(textTemplate.value) : "";

		if (
			textTemplate &&
			textFragments &&
			textFragments.value &&
			Array.isArray(textFragments.value) &&
			textTemplate.value
		) {
			const textFrags: string[] = textFragments.value;
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
