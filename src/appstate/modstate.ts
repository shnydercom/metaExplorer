export enum SingleModStateKeysDict {
	initial = "initial",
	loading = "loading",
	readyToUse = "readyToUse",
	error = "error"
}

export interface IModStatus {
	name: string;
	id: string;
	state: SingleModStateKeysDict;
	errorMsg?: string;
}

export interface IModStatePart {
	isIdle: boolean;
	map: {
		[s: string]: IModStatus;
	};
}
