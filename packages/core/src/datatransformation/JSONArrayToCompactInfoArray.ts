import { AbstractDataTransformer } from "./abstractDataTransformer";
import { KVL } from "../ldaccess/KVL";
import { ldBlueprint, BlueprintConfig } from "../ldaccess/ldBlueprint";
import { LDDict } from "../ldaccess/LDDict";
import { UserDefDict } from "../ldaccess/UserDefDict";
import { VisualTypesDict, VisualKeysDict } from "../components/visualcomposition/visualDict";

export const transfInputKey = UserDefDict.inputData;
const transfOutputKey = UserDefDict.outputData;
export const headerField = "HeaderTextField";
export const shField = "SubHeaderTextField";

export const JSONArrayToCompactInfoArrayName: string = "data/JSONArrayToCompactInfoArray";

export const ToCompactInfoArrayItptKeys: string[] = [transfInputKey, headerField, shField];
export const ToCompactInfoArrayOutputKVs: KVL[] = [
	{
		key: transfOutputKey,
		value: undefined,
		ldType: VisualTypesDict.compactInfoElement
	}
];

const ownKVLs: KVL[] = [
	{
		key: transfInputKey,
		value: undefined,
		ldType: undefined
	},
	{
		key: headerField,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: shField,
		value: undefined,
		ldType: LDDict.Text
	},
	...ToCompactInfoArrayOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: JSONArrayToCompactInfoArrayName,
	ownKVLs: ownKVLs,
	inKeys: ToCompactInfoArrayItptKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class JSONArrayToCompactInfoArray extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = ToCompactInfoArrayItptKeys;
		this.outputKvStores = ToCompactInfoArrayOutputKVs;
	}

	/**
	 * this function turns an input such as
	 * [{propA: "contentA1", propB: "contentB1", propC: "ignored"},
	 *  {propA: "contentA2", propB: "contentB2", propC: "ignoredAgain"}]
	 * into [{HeaderText: "contentA1", SubHeaderText: "contentB1"}, {HeaderText: "contentA2", SubHeaderText: "contentB2"}
	 * condition: if HeaderField === "propA" && SubHeaderField === "propB"
	 * @param inputParams
	 * @param outputKvStores
	 */
	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		//TODO: actually implement
		let rv = [];
		let jsonArrKv = inputParams.get(transfInputKey);
		let headerFieldKv = inputParams.get(headerField);
		let shFieldKv = inputParams.get(shField);
		if (jsonArrKv && headerFieldKv && shFieldKv) {
			if (jsonArrKv.value && headerFieldKv.value && shFieldKv.value
				&& Array.isArray(jsonArrKv.value)) {
				let jsonArr: any[] = jsonArrKv.value;
				//source type constants
				const headerFieldConst = headerFieldKv.value;
				const shFieldConst = shFieldKv.value;
				//target type constants
				const headerTextConst = VisualKeysDict.headerTxt;
				const subHeaderTextConst = VisualKeysDict.subHeaderTxt;
				const primaryItptConst = VisualKeysDict.primaryItpt;
				const secondaryItptConst = VisualKeysDict.secondaryItpt;
				//output var
				let outputValArr = [];
				jsonArr.forEach((arrElem, idx) => {
					let compactInfoElem = arrElem
						? {
							[headerTextConst]: arrElem[headerFieldConst] ? arrElem[headerFieldConst] : null,
							[subHeaderTextConst]: arrElem[shFieldConst] ? arrElem[shFieldConst] : null,
							[primaryItptConst]: null,
							[secondaryItptConst]: null
						}
						:
						{
							[headerTextConst]: null,
							[subHeaderTextConst]: null,
							[primaryItptConst]: null,
							[secondaryItptConst]: null
						};
					outputValArr.push(compactInfoElem);
				});
				const transfOutputKV = outputKvStores.get(transfOutputKey);
				transfOutputKV.value = outputValArr;
				rv = [transfOutputKV];
			}
		}
		return rv;
	}
}
