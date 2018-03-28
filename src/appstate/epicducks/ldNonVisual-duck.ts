import { IBlueprintItpt } from "ldaccess/ldBlueprint";
import { ILDNonvisualIntrprtrMapStatePart } from "appstate/store";

export const LDNONVIS_SET = 'shnyder/LDNONVIS_SET';
export const LDNONVIS_DELETE = 'shnyder/LDNONVIS_DELETE';

export type LDNonVisAction =
	{ type: 'shnyder/LDNONVIS_SET', alias: string, intrprtr: IBlueprintItpt }
	| { type: 'shnyder/LDNONVIS_DELETE', alias: string };

/**
 * sets a non-visual interpreter. If one exists with that alias and the cfg is same it will keep the old one
 * @param alias the key/alias under which the interpreter is saved
 * @param intrprtr the interpreter-object
 */
export const ldNonVisSETAction = (alias: string, intrprtr: IBlueprintItpt) =>
	({ type: LDNONVIS_SET, alias, intrprtr });
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
