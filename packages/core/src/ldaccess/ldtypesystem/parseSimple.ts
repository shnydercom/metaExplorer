import { KVL } from "../KVL";

export const parseBoolean = (inputKv: KVL): boolean => {
	if (!inputKv) return false;
	let input = inputKv.value;
	return input === undefined || input === null ? false : input;
};
export const parseText = (inputKv: KVL): string => {
	if (!inputKv) return "";
	let input = inputKv.value;
	return input ? input : '';
};
export const parseDate = (inputKv: KVL): Date => {
	if (!inputKv) return new Date();
	let input = inputKv.value;
	if (!input) return new Date();
	try {
		return new Date(Date.parse(input));
	} catch (error) {
		return input;
	}
};
export const parseTime = (inputKv: KVL): Date => {
	if (!inputKv) return new Date();
	let input = inputKv.value;
	return input ? input : new Date();
};
export const parseNumber = (inputKv: KVL): number => {
	if (!inputKv) return 0;
	let input = inputKv.value;
	return input ? input : 0;
};
/*export const parseLabel = (inputKv, descrKv: KVL): string => {
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
