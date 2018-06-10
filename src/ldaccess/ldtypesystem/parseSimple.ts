import { IKvStore } from "../ikvstore";
import { LDDict } from "../LDDict";

export const parseBoolean = (inputKv: IKvStore): boolean => {
	if (!inputKv) return false;
	let input = inputKv.value;
	return input === undefined || input === null ? false : input;
};
export const parseText = (inputKv: IKvStore): string => {
	if (!inputKv) return "";
	let input = inputKv.value;
	return input ? input : '';
};
export const parseDate = (inputKv: IKvStore): Date => {
	if (!inputKv) return new Date();
	let input = inputKv.value;
	return input ? input : new Date();
};
export const parseTime = (inputKv: IKvStore): Date => {
	if (!inputKv) return new Date();
	let input = inputKv.value;
	return input ? input : new Date();
};
export const parseNumber = (inputKv: IKvStore): number => {
	if (!inputKv) return 0;
	let input = inputKv.value;
	return input ? input : 0;
};
/*export const parseLabel = (inputKv, descrKv: IKvStore): string => {
	if (descrKv) {
		if (descrKv.ldType === LDDict.Text && descrKv.value !== null && descrKv.value !== undefined) {
			return descrKv.value;
		}
	}
	if (!inputKv) return "";
	let input = inputKv.key;
	return input ? input : '';
};
*/
