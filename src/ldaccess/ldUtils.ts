export let isInterpreter = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty("cfg");
};
