export let isInterpreter = (input: any): boolean => {
	if (!input) return false;
	return input.hasOwnProperty("cfg");
};

export let isUID = (input: string): boolean => {
	let regExp = new RegExp("^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$");
	return regExp.test(input);
};
