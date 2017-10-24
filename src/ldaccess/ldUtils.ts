export let isInterpreter = (input: any): boolean => {
	return input.hasOwnProperty("forType");
};
