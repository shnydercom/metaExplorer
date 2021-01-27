import { AbstractDataTransformer } from "../../datatransformation";
import { BlueprintConfig, KVL, ldBlueprint, LDDict, UserDefDict } from "../../ldaccess";

export const ARITHMETIC_OPERANDS = "maths/arithmetic/operands";

export const ADDITION_TYPE = "maths/arithmetic/Addition-Type";
export const MULTIPLICATION_TYPE = "maths/arithmetic/Multiplication-Type";

export const ARITHMETIC_OUTPUT_TYPE = LDDict.Double;

export const MultiplicationName: string = "maths/arithmetic/Multiplication";
export const AdditionName: string = "maths/arithmetic/Addition";

export const multiplicationOrAdditionItptKeys: string[] = [ARITHMETIC_OPERANDS];
export const ArithmeticOutputKVs: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: ARITHMETIC_OUTPUT_TYPE
	}
];

const multiplicationOrAdditionKVLs: KVL[] = [
	{
		key: ARITHMETIC_OPERANDS,
		value: undefined,
		ldType: LDDict.Double
	},
	...ArithmeticOutputKVs
];

let additionBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: AdditionName,
	ownKVLs: multiplicationOrAdditionKVLs,
	inKeys: multiplicationOrAdditionItptKeys,
	crudSkills: "cRUd"
};

let multiplicationBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MultiplicationName,
	ownKVLs: multiplicationOrAdditionKVLs,
	inKeys: multiplicationOrAdditionItptKeys,
	crudSkills: "cRUd"
};

class MultiplicationOrAddition extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = multiplicationOrAdditionItptKeys;
		this.outputKvStores = ArithmeticOutputKVs;
	}

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];
		const operands = inputParams.get(ARITHMETIC_OPERANDS);
		const outputDataKV = outputKvStores.get(UserDefDict.outputData);

		let operationResult = 0;

		if(operands && operands.value){
			if(this.cfg.nameSelf === MultiplicationName){
				operationResult = (operands.value as number[]).reduce((prev, cur) => prev*cur, 1);
			}
			if(this.cfg.nameSelf === AdditionName){
				operationResult = (operands.value as number[]).reduce((prev, cur) => prev+cur, 0);
			}
		}

		outputDataKV.value = operationResult;
		rv = [
			outputDataKV
		];
		return rv;
	}
}

export const MultiplicationBlock = ldBlueprint(multiplicationBpCfg)(MultiplicationOrAddition);
export const AdditionBlock = ldBlueprint(additionBpCfg)(MultiplicationOrAddition);

// 