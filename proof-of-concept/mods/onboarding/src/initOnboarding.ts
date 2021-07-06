const onboardingEditorJson = require('./onboardingEditor.json'); //CRA doesn't import sub-module json correctly, would have to be packed
const onboardingQRJson = require('./onboardingQR.json');
import { PureRefMapItpt, PureBaseContainerRewrite, UserDefDict, LayoutVHCenteredColumnName, PureVHcenteredColumnLayout,
	ReduxItptRetriever, appItptMatcherFn, BlueprintConfig, LDDict,IModStatus, SingleModStateKeysDict ,
	ITPT_TAG_ATOMIC, ITPT_TAG_SPECIAL, ITPT_TAG_MOD, addBlueprintToRetriever, appItptRetrFn} from "@metaexplorer/core";
import { SignInSignupRequest, signinSignupName } from "./components/signin-signup-request";

export const MOD_ONBOARDING_ID = "onboarding";
export const MOD_ONBOARDING_NAME = "Onboarding Mod";
export const MOD_ONBOARDING_RETRIEVER_NAME = "onboardingRetriever";

export function initOnboardingMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		let onboardingEditorCfg: BlueprintConfig = onboardingEditorJson;
		let onboardingQRCfg: BlueprintConfig = onboardingQRJson;
		addBlueprintToRetriever(onboardingEditorCfg);
		//new retriever for onboarding, limits the number of blocks displayed
		let onboardingRetrieverRedux = new ReduxItptRetriever(MOD_ONBOARDING_RETRIEVER_NAME);
		appItptMatcherFn().setItptRetriever(MOD_ONBOARDING_RETRIEVER_NAME, onboardingRetrieverRedux);
		//set all possible blocks for onboarding
		let qrGenName = "qr/QRCodeDisplay";
		onboardingRetrieverRedux.addItpt(qrGenName, appIntRetr.getItptByNameSelf(qrGenName), "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		let textInputName = LDDict.Text;
		onboardingRetrieverRedux.addItpt(textInputName, appIntRetr.getItptByNameSelf("metaexplorer.io/material-design/" + textInputName), "CRUd", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		onboardingRetrieverRedux.addItpt(LayoutVHCenteredColumnName, PureVHcenteredColumnLayout, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		appIntRetr.addItpt(signinSignupName, SignInSignupRequest, "cRud", [ITPT_TAG_ATOMIC, ITPT_TAG_MOD]);
		onboardingRetrieverRedux.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud", [ITPT_TAG_SPECIAL]);
		onboardingRetrieverRedux.addItpt(UserDefDict.itptContainerObjType, PureBaseContainerRewrite, "cRud", [ITPT_TAG_SPECIAL]);
		addBlueprintToRetriever(onboardingQRCfg, MOD_ONBOARDING_RETRIEVER_NAME);
		resolve({ id: MOD_ONBOARDING_ID, name: MOD_ONBOARDING_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
