import { ILDOptionsMapStatePart } from "../store";
import { ILDOptions } from "ldaccess/ildoptions";

/**
 * a duck for ReferenceMap-handling.
 * Note: No epic has been added yet
 */

export const REFMAP_PREFILL = 'shnyder/REFMAP_PREFILL'; //fills all static/non-ObjProp, nonldTkStrngRef, 
export const REFMAP_FILL = 'shnyder/REFMAP_FILL';

export type RefMapAction =
	{ type: 'shnyder/REFMAP_PREFILL', ldOptionsBase: ILDOptions }
	| { type: 'shnyder/REFMAP_FILL', ldOptionsBase: ILDOptions };

//Action factories, return action Objects
export const refMapPREFILLAction = (updatedLDOptions: ILDOptions) => ({ type: REFMAP_PREFILL, ldOptionsBase: updatedLDOptions });

export const refMapFILLAction = (updatedLDOptions: ILDOptions) => ({ type: REFMAP_FILL, ldOptionsBase: updatedLDOptions });

export const refMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: RefMapAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case REFMAP_PREFILL:
			return state;
		case REFMAP_FILL:
			return state;
		default:
			break;
	}
	return state;
};
