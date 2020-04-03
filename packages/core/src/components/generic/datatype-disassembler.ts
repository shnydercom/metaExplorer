import { IKvStore } from "../../ldaccess/ikvstore";
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
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];

		const inputKV = inputParams.get(transfInputKey);

		//output var
		let outputValArr = [];

		outputKvStores.forEach((val, idx) => {
			const newOutputObj: IKvStore = {
				key: val.key,
				value: inputKV.value[val.key],
				ldType: val.ldType
			};
			outputValArr.push(newOutputObj);
		});

		rv = outputValArr;
		return rv;
	}
}

export function flatDataTypeDisassemblerFactory(outputKvStores: IKvStore[], nameSelf: string, inputType: string) {

	const ActionCompInputKVs: IKvStore[] = [
		{
			key: transfInputKey,
			value: undefined,
			ldType: inputType
		}
	];
	const initialKvStores: IKvStore[] = [
		...ActionCompInputKVs,
		...outputKvStores,
	];

	const interpretableKeys: string[] = [transfInputKey];

	let bpCfg: BlueprintConfig = {
		subItptOf: null,
		nameSelf,
		initialKvStores,
		interpretableKeys,
		crudSkills: "cRUd"
	};

	let DataTypeDisassemblerExt = class extends PureDataTypeDisassembler {
		itptKeys = interpretableKeys;
		outputKvStores = outputKvStores;
	};
	return ldBlueprint(bpCfg)(DataTypeDisassemblerExt);
}
