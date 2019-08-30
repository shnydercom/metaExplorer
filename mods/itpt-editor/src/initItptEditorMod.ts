import {
	appItptRetrFn, IModStatus, SingleModStateKeysDict, changeMainAppItpt, ITPT_TAG_ATOMIC, ITPT_TAG_MOD, BlueprintConfig, addBlueprintToRetriever} from "@metaexplorer/core";
import {	PureAppItptEditor, ITPT_BLOCK_EDITOR_TYPE} from "./components/LDToEditorWrapper";

const connectedEditorJSON = require('./connected-editor.json');

export const MOD_ITPTEDITOR_ID = "itpt-editor";
export const MOD_ITPTEDITOR_NAME = "Block Editor Mod";

export function initItptEditorMod(isMainItptChange: boolean): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let connectedEditorCfg: BlueprintConfig = connectedEditorJSON;
		addBlueprintToRetriever(connectedEditorCfg, "default");
		let startingInstance = [/*{
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: "shnyder/metaexplorer/MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
			value: "shnyder/metaexplorer/MainAppEntryPoint",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_IS_GLOBAL,
			value: true,
			ldType: LDDict.Boolean
		},
		{
			key: ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW,
			value: true,
			ldType: LDDict.Boolean
		},
		{
			key: ITPT_BLOCK_EDITOR_HIDDEN_VIEWS,
			value: undefined,
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_RETRIEVER_NAME,
			value: undefined,
			ldType: LDDict.Text
		},
		{
			key: UserDefDict.username,
			value: undefined,
			ldType: LDDict.Text
		},
		{
			key: UserDefDict.projectname,
			value: undefined,
			ldType: LDDict.Text
		},
		{
			key: SAVE_ACTION_LDTYPE,
			value: "save-editor-action",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_SAVING_STATUS,
			value: undefined,
			ldType: UserDefDict.responseWrapperType
		},*/
		];
		if (isMainItptChange) changeMainAppItpt("shnyder/metaexplorer/connected-editor", startingInstance);
		resolve({ id: MOD_ITPTEDITOR_ID, name: MOD_ITPTEDITOR_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
