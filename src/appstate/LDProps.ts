import { ILDOptions } from "ldaccess/ildoptions";
import { OutputKVMap } from "ldaccess/ldBlueprint";
import { RouteComponentProps } from 'react-router';

export interface LDRouteParams {
	nextPath: string;
}
export interface LDRouteProps extends RouteComponentProps<LDRouteParams> {}

export type LDOwnProps = {
	ldTokenString: string,
	outputKVMap: OutputKVMap,
	routes?: LDRouteProps
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
