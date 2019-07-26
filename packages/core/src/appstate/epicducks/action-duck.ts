import { ILDActionsHandlerStatePart } from 'appstate/store';
export const REGISTER_ID_HANDLER = 'shnyder/REGISTER_ID_HANDLER';
export const REGISTER_TYPE_HANDLER = 'shnyder/REGISTER_TYPE_HANDLER';
export const UNREGISTER_HANDLER = 'shnyder/UNREGISTER_HANDLER';

export type ActionMapAction =
	{ type: 'shnyder/REGISTER_ID_HANDLER', handlesId: string, ldTkStr: string } |
	{ type: 'shnyder/REGISTER_TYPE_HANDLER', handlesType: string, ldTkStr: string } |
	{ type: 'shnyder/UNREGISTER_HANDLER', ldTkStr: string };

//Action factories
export const registerIdActionHandlerAction = (handlesId: string, ldTkStr: string): ActionMapAction => ({
	type: REGISTER_ID_HANDLER,
	handlesId,
	ldTkStr
});

export const registerTypeActionHandlerAction = (handlesType: string, ldTkStr: string): ActionMapAction => ({
	type: REGISTER_TYPE_HANDLER,
	handlesType,
	ldTkStr
});

export const unregisterHandlerAction = (ldTkStr: string): ActionMapAction => ({
	type: UNREGISTER_HANDLER,
	ldTkStr
});

export const actionHandlerReducer = (state: ILDActionsHandlerStatePart, action: ActionMapAction): ILDActionsHandlerStatePart => {
	const rvState = { ...state };
	const { ldTkStr } = action;
	switch (action.type) {
		case REGISTER_ID_HANDLER:
			rvState.idHandler[action.handlesId] = ldTkStr;
			break;
		case REGISTER_TYPE_HANDLER:
			rvState.typehandler[action.handlesType] = ldTkStr;
			break;
		case UNREGISTER_HANDLER:
			const typeMap = rvState.typehandler;
			for (const prop in typeMap) {
				if (typeMap.hasOwnProperty(prop)) {
					const typeElem = typeMap[prop];
					if (typeElem === ldTkStr) {
						typeMap[prop] = undefined;
					}
				}
			}
			const idMap = rvState.idHandler;
			for (const idProp in idMap) {
				if (idMap.hasOwnProperty(idProp)) {
					const idElem = idMap[idProp];
					if (idElem === ldTkStr) {
						idMap[idProp] = undefined;
					}
				}
			}
			break;
		default:
			break;
	}
	return rvState;
};
