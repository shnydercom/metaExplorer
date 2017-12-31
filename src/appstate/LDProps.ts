import { ILDOptions } from "ldaccess/ildoptions";
import { OutputKVMap } from "ldaccess/ldBlueprint";

export type LDOwnProps = {
	ldTokenString: string;
	outputKVMap: OutputKVMap;
};

export type LDConnectedDispatch = {
	/**
	 * IMPORTANT: use ldOptionsDeepCopy() before to create a new ldOptions-Object as a parameter here
	 */
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};

export type LDConnectedState = {
	ldOptions: ILDOptions
};
