import { KVL } from "../../ldaccess/KVL";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { AbstractDataTransformer } from "../../datatransformation/abstractDataTransformer";

const transfInputKey = UserDefDict.inputData;

class PureDataTypeDisassembler extends AbstractDataTransformer {

	/**
	 * this function assembles input fields to a single flat new datatype
	 * @param inputParams
	 * @param outputKvStores
	 */
	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];

		let inputKV = inputParams.get(transfInputKey);

		//output var
		let outputValArr = [];

		outputKvStores.forEach((val, idx) => {
			const newOutputObj: KVL = {
				key: val.key,
				value: inputKV && (inputKV.value !== undefined && inputKV.value !== null) ? inputKV.value[val.key] : null,
				ldType: val.ldType
			};
			outputValArr.push(newOutputObj);
		});

		rv = outputValArr;
		return rv;
	}
}

export function flatDataTypeDisassemblerFactory(outputKvStores: KVL[], nameSelf: string, inputType: string) {

	const ActionCompInputKVs: KVL[] = [
		{
			key: transfInputKey,
			value: undefined,
			ldType: inputType
		}
	];
	const ownKVLs: KVL[] = [
		...ActionCompInputKVs,
		...outputKvStores,
	];

	const inKeys: string[] = [transfInputKey];

	let bpCfg: BlueprintConfig = {
		subItptOf: null,
		nameSelf,
		ownKVLs,
		inKeys,
		crudSkills: "cRUd"
	};

	let DataTypeDisassemblerExt = class extends PureDataTypeDisassembler {
		itptKeys = inKeys;
		outputKvStores = outputKvStores;
	};
	return ldBlueprint(bpCfg)(DataTypeDisassemblerExt);
}
