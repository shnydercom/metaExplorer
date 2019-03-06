import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { changeMainAppItpt } from "appconfig/retrieverAccessFns";
import { ITPT_TAG_ATOMIC, ITPT_TAG_MOD } from "ldaccess/iitpt-retriever";
import { ITPT_BLOCK_EDITOR_NAME, PureAppItptEditor, ITPT_BLOCK_EDITOR_TYPE, ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT, ITPT_BLOCK_EDITOR_IS_GLOBAL } from "./components/appitpt-editor";
import { LDDict } from "ldaccess/LDDict";

export const MOD_ITPTEDITOR_ID = "itpt-editor";
export const MOD_ITPTEDITOR_NAME = "Block Editor Mod";

export function initItptEditorMod(isMainItptChange: boolean): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let startingInstance = [ {
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: "MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
			value: "MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_IS_GLOBAL,
			value: true,
			ldType: LDDict.Boolean
		}
		];
		if (isMainItptChange) changeMainAppItpt(ITPT_BLOCK_EDITOR_NAME, startingInstance);
		resolve({ id: MOD_ITPTEDITOR_ID, name: MOD_ITPTEDITOR_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		return rv;
	});
	return rv;
}
