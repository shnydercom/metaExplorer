import { appItptRetrFn } from "../appconfig/appItptRetriever";
import { PureRefMapItpt } from "../components/generic/RefMapItpt-component";
import { UserDefDict } from "../ldaccess/UserDefDict";
import { PureBaseContainerRewrite } from "../components/generic/baseContainer-rewrite";
import { ITPT_TAG_SPECIAL, ITPT_TAG_ATOMIC } from "../ldaccess/iitpt-retriever";
import { magicCanInterpretType, PureMagicBox } from "../components/generic/magicBox";
import { projCfgName, PureProjectConfig } from "../components/project-config";
import { ActionComp, ActionCompName } from "../components/actions/ActionComp";
import { ActionHandler, ActionHandlerName } from "../components/actions/ActionHandler";
import { ActionDispatcherName, ActionDispatcher } from "../components/actions/ActionDispatcher";

export function initEssentialItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud", [ITPT_TAG_SPECIAL]);
	appIntRetr.addItpt(UserDefDict.itptContainerObjType, PureBaseContainerRewrite, "cRud", [ITPT_TAG_SPECIAL]);
	appIntRetr.addItpt(magicCanInterpretType, PureMagicBox, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(projCfgName, PureProjectConfig, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ActionCompName, ActionComp, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ActionHandlerName, ActionHandler, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ActionDispatcherName, ActionDispatcher, "cRud", [ITPT_TAG_ATOMIC]);
}
