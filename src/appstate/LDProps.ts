import { ILDOptions } from "ldaccess/ildoptions";
import { OutputKVMap, BlueprintConfig } from "ldaccess/ldBlueprint";
import { RouteComponentProps } from 'react-router';
import { IKvStore } from "ldaccess/ikvstore";

export interface LDRouteParams {
	nextPath: string;
}
export interface LDRouteProps extends RouteComponentProps<LDRouteParams> {}

export type LDOwnProps = {
	ldTokenString: string,
	routes?: LDRouteProps
};

export type LDConnectedDispatch = {
	/**
	 * IMPORTANT: use ldOptionsDeepCopy() before to create a new ldOptions-Object as a parameter here.
	 * Are you sure you don't want to use dispatchKvOutput?
	 */
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
	/**
	 * notifies the store to split the KvStores in this ldOptions.resource in a linear fashion. After
	 * completion, the store will have n new values at the keys ldOptions.ldToken+"-l"+(0..n-1)
	 */
	notifyLDOptionsLinearSplitChange: (ldOptions: ILDOptions) => void;
	/**
	 * notifies the store that the ldOptions-Object should be split according to what's defined in the
	 * refMap
	 * @param refMap The BlueprintConfig must be a refMap-Blueprint.
	 */
	notifyLDOptionsRefMapSplitChange: (ldOptions: ILDOptions, refMap: BlueprintConfig) => void;
	/**
	 * dispatches changes inside an itpt to the store, use this to handle updating values.
	 * @param thisLdTkStr is the LD-Token of the itpt from which the update gets dispatched
	 * @param updatedKvMap the values that shall be updated. Unchanged values of the kvMap aren't affected
	 */
	dispatchKvOutput: (changedKvStores: IKvStore[], thisLdTkStr: string, updatedKvMap: OutputKVMap) => void;
};

export type LDConnectedState = {
	ldOptions: ILDOptions
};
