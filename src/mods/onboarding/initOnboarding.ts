import appItptRetrFn from "appconfig/appItptRetriever";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { addBlueprintToRetriever } from "appconfig/retrieverAccessFns";
import { ITPT_TAG_ATOMIC, ITPT_TAG_SPECIAL, ITPT_TAG_MOD } from "ldaccess/iitpt-retriever";
import { LDDict } from "ldaccess/LDDict";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { appItptMatcherFn } from "appconfig/appItptMatcher";

import * as onboardingEditorJson from './onBoardingEditor.json';
import * as onboardingQRJson from './onBoardingQR.json';
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";
import { LayoutVHCenteredColumnName, PureVHcenteredColumnLayout } from "components/layout/layoutBaseComp";
import { UserDefDict } from "ldaccess/UserDefDict";
import { PureBaseContainerRewrite } from "components/generic/baseContainer-rewrite";
import { PureRefMapItpt } from "components/generic/RefMapItpt-component";

export const MOD_ONBOARDING_ID = "onboarding";
export const MOD_ONBOARDING_NAME = "Onboarding Mod";
export const MOD_ONBOARDING_RETRIEVER_NAME = "onboardingRetriever";

export function initOnboardingMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		let onboardingEditorCfg: BlueprintConfig = onboardingEditorJson as any;
		let onboardingQRCfg: BlueprintConfig = onboardingQRJson as any;
		addBlueprintToRetriever(onboardingEditorCfg);
		//new retriever for onboarding, limits the number of blocks displayed
		let onboardingRetrieverRedux = new ReduxItptRetriever(MOD_ONBOARDING_RETRIEVER_NAME);
		appItptMatcherFn().setItptRetriever(MOD_ONBOARDING_RETRIEVER_NAME, onboardingRetrieverRedux);
		//set all possible blocks for onboarding
		let qrGenName = "qr/QRCodeDisplay";
		onboardingRetrieverRedux.addItpt(qrGenName, appIntRetr.getItptByNameSelf(qrGenName), "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let textInputName = LDDict.Text;
		onboardingRetrieverRedux.addItpt(textInputName, appIntRetr.getItptByNameSelf("shnyder/material-design/" + textInputName), "CRUd", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		onboardingRetrieverRedux.addItpt(LayoutVHCenteredColumnName, PureVHcenteredColumnLayout, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		onboardingRetrieverRedux.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud", [ITPT_TAG_SPECIAL]);
		onboardingRetrieverRedux.addItpt(UserDefDict.itptContainerObjType, PureBaseContainerRewrite, "cRud", [ITPT_TAG_SPECIAL]);
		addBlueprintToRetriever(onboardingQRCfg, MOD_ONBOARDING_RETRIEVER_NAME);
		resolve({ id: MOD_ONBOARDING_ID, name: MOD_ONBOARDING_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
