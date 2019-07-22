import { IKvStore } from "../ikvstore";
import { LDDict } from "../LDDict";
import { VisualKeysDict, VisualTypesDict } from "components/visualcomposition/visualDict";

/**
 * type checking, which largely ignores unset types but enforces type mapping setup for existing types
 * @param inputKv the input KvStore
 * @param targetKv the target KvStore
 */
export const isInputValueValidFor: (inputKv: IKvStore, targetKv: IKvStore) => boolean
	= (inputKv, targetKv) => {
		if (inputKv.ldType && targetKv.ldType) {
			if (inputKv.ldType !== targetKv.ldType) {
				const inputMatrixKey = typeMatrixKeyMap.get(inputKv.ldType);
				const targetMatrixKey = typeMatrixKeyMap.get(targetKv.ldType);
				if (inputMatrixKey === undefined || targetMatrixKey === undefined) return false;
				return typeMatrix[inputMatrixKey][targetMatrixKey];
			}
			return true;
		}
		return true;
	};

export const typeMatrixKeyMap: Map<string, number> = new Map();
typeMatrixKeyMap.set(LDDict.Text, 0);
typeMatrixKeyMap.set(VisualTypesDict.route_added, 1);
typeMatrixKeyMap.set(LDDict.URL, 2);

//format: [inputIdx][targetIdx]
export const typeMatrix: boolean[][] = [
	[true, true, true],
	[true, true, false],
	[true, false, true]
];

export function getLDPrototypeOf(typeName: string): object {
	if (!ldPrototypeMap.has(typeName)) return {};
	return ldPrototypeMap.get(typeName);
}

export const ldPrototypeMap: Map<string, object> = new Map();
ldPrototypeMap.set(VisualTypesDict.compactInfoElement,
	{
		[VisualKeysDict.primaryItpt]: null,
		[VisualKeysDict.secondaryItpt]: null,
		[VisualKeysDict.headerTxt]: null,
		[VisualKeysDict.subHeaderTxt]: null
	}
);
