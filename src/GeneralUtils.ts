/**
 * checks juggling if any of the parameters is null or undefined
 * @param inputs the input parameters
 */
export const checkAllFilled = (...inputs): boolean => {
	if (!inputs) return false;
	for (let i = 0; i < inputs.length; i++) {
		const a = inputs[i];
		if (a === null || a === undefined) return false;
	}
	return true;
};
