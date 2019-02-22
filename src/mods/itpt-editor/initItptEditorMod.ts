import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { changeMainAppItpt } from "appconfig/retrieverAccessFns";
import { ITPT_TAG_ATOMIC, ITPT_TAG_MOD } from "ldaccess/iitpt-retriever";
import { ITPT_BLOCK_EDITOR_NAME, PureAppItptEditor, ITPT_BLOCK_EDITOR_TYPE } from "./components/appitpt-editor";

export const MOD_ITPTEDITOR_ID = "itpt-editor";
export const MOD_ITPTEDITOR_NAME = "Block Editor Mod";

export function initItptEditorMod(isMainItptChange: boolean): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		if (isMainItptChange) changeMainAppItpt(ITPT_BLOCK_EDITOR_NAME);
		resolve({ id: MOD_ITPTEDITOR_ID, name: MOD_ITPTEDITOR_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		return rv;
	});
	return rv;
}
