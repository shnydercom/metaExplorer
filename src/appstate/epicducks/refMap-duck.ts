import { ILDOptionsMapStatePart } from "../store";

/**
 * a duck for ReferenceMap-handling.
 * Note: No epic has been added yet
 */

export const REFMAP_REQUEST = 'shnyder/REFMAP_REQUEST';
export const REFMAP_CREATE = 'shnyder/REFMAP_CREATE';

export type RefMapAction =
	{ type: 'shnyder/REFMAP_REQUEST' }
	| { type: 'shnyder/REFMAP_CREATE' };

//Action factories, return action Objects
export const refMapRequestAction = () => ({ type: REFMAP_REQUEST });

export const refMapCreateAction = () => ({ type: REFMAP_CREATE });

export const refMapReducer = (
	state: ILDOptionsMapStatePart = {}, action: RefMapAction): ILDOptionsMapStatePart => {
	switch (action.type) {
		case REFMAP_REQUEST:
			return state;
		case REFMAP_CREATE:
			return state;
		default:
			break;
	}
	return state;
};
