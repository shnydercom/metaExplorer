import {
	appItptRetrFn, IModStatus, SingleModStateKeysDict, changeMainAppItpt, ITPT_TAG_ATOMIC, ITPT_TAG_MOD, LDDict
} from "@metaexplorer/core";
import {
	ITPT_BLOCK_EDITOR_NAME, PureAppItptEditor, ITPT_BLOCK_EDITOR_TYPE, ITPT_BLOCK_EDITOR_EDITING_ITPT,
	ITPT_BLOCK_EDITOR_DISPLAYING_ITPT, ITPT_BLOCK_EDITOR_IS_GLOBAL, ITPT_BLOCK_EDITOR_RETRIEVER_NAME
} from "./components/appitpt-editor";

export const MOD_ITPTEDITOR_ID = "itpt-editor";
export const MOD_ITPTEDITOR_NAME = "Block Editor Mod";

export function initItptEditorMod(isMainItptChange: boolean): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let startingInstance = [{
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: "shnyder/meta-explorer/MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
			value: "shnyder/meta-explorer/MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_IS_GLOBAL,
			value: true,
			ldType: LDDict.Boolean
		},
		{
			key: ITPT_BLOCK_EDITOR_RETRIEVER_NAME,
			value: "default",
			ldType: LDDict.Text
		}
		];
		if (isMainItptChange) changeMainAppItpt(ITPT_BLOCK_EDITOR_NAME, startingInstance);
		resolve({ id: MOD_ITPTEDITOR_ID, name: MOD_ITPTEDITOR_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}