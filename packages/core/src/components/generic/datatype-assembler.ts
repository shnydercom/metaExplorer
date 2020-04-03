import { IKvStore } from "../../ldaccess/ikvstore";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { VisualTypesDict } from "../../components/visualcomposition/visualDict";
import { AbstractDataTransformer } from "../../datatransformation/abstractDataTransformer";
import { itptKeysFromInputKvs } from "../../ldaccess/ldUtils";
import { LDUIDict } from "../../ldaccess";

const transfOutputKey = UserDefDict.outputData;

const DATATYPE_ASSEMBLER_CFG: BlueprintConfig = {
	subItptOf: null,
	nameSelf: LDUIDict.DataTypeAssembler,
	initialKvStores: [],
	interpretableKeys: [],
	crudSkills: "cRud"
};

class AbstractDataTypeAssembler extends AbstractDataTransformer {

	/**
	 * this function assembles input fields to a single flat new datatype
	 * @param inputParams
	 * @param outputKvStores
	 */
	protected mappingFunction(
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];

		const newOutputObj = {
		};

		inputParams.forEach((val) => {
			newOutputObj[val.key] = val.value;
		});

		//output var
		let outputValArr = [newOutputObj];
		const transfOutputKV = outputKvStores.get(transfOutputKey);
		transfOutputKV.value = outputValArr;
		rv = [transfOutputKV];
		return rv;
	}
}

export const DataTypeDisassembler = ldBlueprint(DATATYPE_ASSEMBLER_CFG)(AbstractDataTypeAssembler);

export function flatDataTypeAssemblerFactory(inputKvStores: IKvStore[], nameSelf: string) {

	const ActionCompOutputKVs: IKvStore[] = [
		{
			key: transfOutputKey,
			value: undefined,
			ldType: VisualTypesDict.compactInfoElement
		}
	];
	const initialKvStores: IKvStore[] = [
		...inputKvStores,
		...ActionCompOutputKVs
	];

	const interpretableKeys: string[] = itptKeysFromInputKvs(inputKvStores);

	let bpCfg: BlueprintConfig = {
		subItptOf: null,
		nameSelf,
		initialKvStores,
		interpretableKeys,
		crudSkills: "cRUd"
	};

	let DataTypeAssemblerExt = class extends AbstractDataTypeAssembler {
		itptKeys = interpretableKeys;
		outputKvStores = ActionCompOutputKVs;
	};
	return ldBlueprint(bpCfg)(DataTypeAssemblerExt);
}
