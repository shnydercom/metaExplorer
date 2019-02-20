import { IAppConfigStatePart } from "appstate/store";

export const ACTION_APPCFG_UPDATE_KEY = 'shnyder/APPCFG_UPDATE_KEY';
export const ACTION_APPCFG_UPDATE_ITPT = 'shnyder/APPCFG_UPDATE_ITPT';

export type AppCfgAction =
	{ type: 'shnyder/APPCFG_UPDATE_KEY', appKey: string } |

	{ type: 'shnyder/APPCFG_UPDATE_ITPT', mainItpt: string };

export const appKeyUpdateAction = (updatedKey: string): AppCfgAction => ({ type: ACTION_APPCFG_UPDATE_KEY, appKey: updatedKey });
export const appItptUpdateAction = (updatedItpt: string): AppCfgAction => ({ type: ACTION_APPCFG_UPDATE_ITPT, mainItpt: updatedItpt });

export const appCfgStatePartReducer = (
	state: IAppConfigStatePart, action: AppCfgAction): IAppConfigStatePart => {
	let newState = Object.assign({}, state);
	switch (action.type) {
		case ACTION_APPCFG_UPDATE_KEY:
			newState.appKey = action.appKey;
			break;
		case ACTION_APPCFG_UPDATE_ITPT:
			newState.mainItpt = action.mainItpt;
			break;
		default:
			break;
	}
	return newState;
};
