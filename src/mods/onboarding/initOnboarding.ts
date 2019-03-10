import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { changeMainAppItpt, addBlueprintToRetriever } from "appconfig/retrieverAccessFns";
import { ITPT_TAG_ATOMIC, ITPT_TAG_MOD } from "ldaccess/iitpt-retriever";
import { LDDict } from "ldaccess/LDDict";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT, ITPT_BLOCK_EDITOR_IS_GLOBAL, ITPT_BLOCK_EDITOR_ACTIVE_VIEWS, ITPT_BLOCK_EDITOR_RETRIEVER_NAME, ITPT_BLOCK_EDITOR_TYPE, PureAppItptEditor, ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW } from "mods/itpt-editor/components/appitpt-editor";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { DefaultItptMatcher } from "defaults/DefaultItptMatcher";

import * as onboardingEditorJson from './onBoardingEditor.json';
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";

export const MOD_ONBOARDING_ID = "onboarding";
export const MOD_ONBOARDING_NAME = "Onboarding Mod";
export const MOD_ONBOARDING_RETRIEVER_NAME = "onboardingRetriever";

export function initOnboardingMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		let onboardingEditorCfg: BlueprintConfig = onboardingEditorJson as any;
		addBlueprintToRetriever(onboardingEditorCfg);
		//new retriever for onboarding, limits the number of blocks displayed
		let onboardingRetrieverRedux = new ReduxItptRetriever();
		appItptMatcherFn().setItptRetriever(MOD_ONBOARDING_RETRIEVER_NAME, onboardingRetrieverRedux);
		resolve({ id: MOD_ONBOARDING_ID, name: MOD_ONBOARDING_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		return rv;
	});
	return rv;
}
