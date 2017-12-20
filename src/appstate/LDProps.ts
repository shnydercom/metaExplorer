import { ILDOptions } from "ldaccess/ildoptions";

export type LDOwnProps = {
	ldTokenString: string;
};

export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};

export type LDConnectedState = {
	ldOptions: ILDOptions
};
