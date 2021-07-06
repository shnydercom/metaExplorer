import { IBlueprintItpt } from "../../ldaccess/ldBlueprint";
import { ILDNonvisualIntrprtrMapStatePart } from "../store";

export const LDNONVIS_SET = 'metaexplorer.io/LDNONVIS_SET';
export const LDNONVIS_DELETE = 'metaexplorer.io/LDNONVIS_DELETE';

export type LDNonVisAction =
	{ type: 'metaexplorer.io/LDNONVIS_SET', alias: string, intrprtr: IBlueprintItpt }
	| { type: 'metaexplorer.io/LDNONVIS_DELETE', alias: string };

/**
 * sets a non-visual itpt. If one exists with that alias and the cfg is same it will keep the old one
 * @param alias the key/alias under which the itpt is saved
 * @param itpt the itpt-object
 */
export const ldNonVisSETAction = (alias: string, itpt: IBlueprintItpt) =>
	({ type: LDNONVIS_SET, alias, itpt });
export const ldNonVisDeleteAction = (alias: string) =>
	({ type: LDNONVIS_DELETE, alias });

export const ldNonVisMapReducer = (
	state: ILDNonvisualIntrprtrMapStatePart = {}, action: LDNonVisAction): ILDNonvisualIntrprtrMapStatePart => {
	let alias = action.alias;
	let newState: ILDNonvisualIntrprtrMapStatePart;
	switch (action.type) {
		case LDNONVIS_SET:
			if (state[alias] && action.intrprtr.constructor["cfg"] === state[alias].constructor["cfg"]) newState = state;
			else
				newState = { ...state, [alias]: action.intrprtr };
			break;
		case LDNONVIS_DELETE:
			newState = { ...state };
			delete newState[alias];
			break;
		default:
			newState = { ...state };
			break;
	} //Object.assign({}, state, { [alias]: newLDCfg });
	return newState;
};
