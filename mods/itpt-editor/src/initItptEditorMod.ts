import {
	appItptRetrFn, IModStatus, SingleModStateKeysDict, changeMainAppItpt, ITPT_TAG_ATOMIC, ITPT_TAG_MOD, BlueprintConfig, addBlueprintToRetriever
} from "@metaexplorer/core";
import { PureAppItptEditor, ITPT_BLOCK_EDITOR_TYPE, ITPT_BLOCK_EDITOR_EDITING_ITPT } from "./components/LDToEditorWrapper";
import { EditorGlobalsPersisterType, EditorGlobalsPersister } from "./components/sideFX/EditorGlobalsPersister";
import { EditorGlobalsRetrieverType, EditorGlobalsRetriever } from "./components/sideFX/EditorGlobalsRetriever";

// tslint:disable-next-line:no-var-requires
const connectedEditorJSON = require('./connected-editor.json');

export const MOD_ITPTEDITOR_ID = "itpt-editor";
export const MOD_ITPTEDITOR_NAME = "Block Editor Mod";

export interface EditorModConfig {
	currrentlyEditing?: string;
}

export function initItptEditorMod(modConfig?: EditorModConfig): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let connectedEditorCfg: BlueprintConfig = connectedEditorJSON;
		let connectedEditorCurrentlyEditing: string =
			(connectedEditorCfg.ownKVLs[0].value["rm-blockeditor"] as BlueprintConfig)
				.ownKVLs.find((kvl) => kvl.key === ITPT_BLOCK_EDITOR_EDITING_ITPT).value;
		const nocodeItpt = modConfig && modConfig.currrentlyEditing ? modConfig.currrentlyEditing : connectedEditorCurrentlyEditing;
		(connectedEditorCfg.ownKVLs[0].value["rm-blockeditor"] as BlueprintConfig)
			.ownKVLs.find((kvl) => kvl.key === ITPT_BLOCK_EDITOR_EDITING_ITPT).value = nocodeItpt;

		addBlueprintToRetriever(connectedEditorCfg, "default");
		let startingInstance = [/*{
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: "metaexplorer.io/v2/index",
			ldType: LDDict.Text
		},
		{
			key: ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
			value: "metaexplorer.io/v2/index",
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
		appIntRetr.addItpt(EditorGlobalsPersisterType, EditorGlobalsPersister, "CrUd", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		appIntRetr.addItpt(EditorGlobalsRetrieverType, EditorGlobalsRetriever, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		if (modConfig) changeMainAppItpt("metaexplorer.io/v1/connected-editor", startingInstance);
		resolve({ id: MOD_ITPTEDITOR_ID, name: MOD_ITPTEDITOR_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
