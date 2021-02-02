import { AbstractDataTransformer } from "../../datatransformation";
import {
	BlueprintConfig,
	KVL,
	ldBlueprint,
	LDDict,
	UserDefDict,
} from "../../ldaccess";

export const ARITHMETIC_OPERAND_ONE = "maths/arithmetic/operand-one";
export const ARITHMETIC_OPERAND_TWO = "maths/arithmetic/operand-two";

export const ADDITION_TYPE = "maths/arithmetic/Addition-Type";
export const MULTIPLICATION_TYPE = "maths/arithmetic/Multiplication-Type";

export const ARITHMETIC_OUTPUT_TYPE = LDDict.Double;

export const MultiplicationName: string = "maths/arithmetic/Multiplication";
export const AdditionName: string = "maths/arithmetic/Addition";

export const multiplicationOrAdditionItptKeys: string[] = [
	ARITHMETIC_OPERAND_ONE, ARITHMETIC_OPERAND_TWO
];
export const ArithmeticOutputKVs: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: ARITHMETIC_OUTPUT_TYPE,
	},
];

const multiplicationOrAdditionKVLs: KVL[] = [
	{
		key: ARITHMETIC_OPERAND_ONE,
		value: undefined,
		ldType: LDDict.Double,
	},
	{
		key: ARITHMETIC_OPERAND_TWO,
		value: undefined,
		ldType: LDDict.Double,
	},
	...ArithmeticOutputKVs,
];

let additionBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: AdditionName,
	ownKVLs: multiplicationOrAdditionKVLs,
	inKeys: multiplicationOrAdditionItptKeys,
	crudSkills: "cRUd",
};

let multiplicationBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MultiplicationName,
	ownKVLs: multiplicationOrAdditionKVLs,
	inKeys: multiplicationOrAdditionItptKeys,
	canInterpretType: MULTIPLICATION_TYPE,
	crudSkills: "cRUd",
};

class MultiplicationOrAddition extends AbstractDataTransformer {
	constructor() {
		super();
		this.itptKeys = multiplicationOrAdditionItptKeys;
		this.outputKvStores = ArithmeticOutputKVs;
	}

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>
	): KVL[] {
		let rv = [];
		debugger;
		const operandKVLs = [
			inputParams.get(ARITHMETIC_OPERAND_ONE),
			inputParams.get(ARITHMETIC_OPERAND_TWO),
		];
		const outputDataKV = outputKvStores.get(UserDefDict.outputData);

		let operationResult = 0;

		if (operandKVLs[0] && operandKVLs[1]) {
			const operandOne = operandKVLs[0].value;
			const operandTwo = operandKVLs[1].value;
			if (operandOne && operandTwo) {
				const operands = [operandOne, operandTwo]
				if (this.cfg.canInterpretType === MULTIPLICATION_TYPE) {
					operationResult = (operands as number[]).reduce(
						(prev, cur) => prev * cur,
						1
					);
				}
				if (this.cfg.canInterpretType === ADDITION_TYPE) {
					operationResult = (operands as number[]).reduce(
						(prev, cur) => prev + cur,
						0
					);
				}
			}
		}

		outputDataKV.value = operationResult;
		rv = [outputDataKV];
		return rv;
	}
}

export const MultiplicationBlock = ldBlueprint(multiplicationBpCfg)(
	MultiplicationOrAddition
);
export const AdditionBlock = ldBlueprint(additionBpCfg)(
	MultiplicationOrAddition
);

//
