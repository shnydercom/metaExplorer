import { IKvStore } from "../ikvstore";
import { LDDict } from "../LDDict";
import { VisualDict } from "components/visualcomposition/visualDict";

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
typeMatrixKeyMap.set(VisualDict.route_added, 1);

export const typeMatrix: boolean[][] = [
	[true, true],
	[true, true]
];
