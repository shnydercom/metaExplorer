import { appItptRetrFn } from "appconfig/appItptRetriever";
import { PureRefMapItpt } from "components/generic/RefMapItpt-component";
import { UserDefDict } from "ldaccess/UserDefDict";
import { PureBaseContainerRewrite } from "components/generic/baseContainer-rewrite";
import { ITPT_TAG_SPECIAL } from "ldaccess/iitpt-retriever";

export function initEssentialItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud", [ITPT_TAG_SPECIAL]);
	appIntRetr.addItpt(UserDefDict.itptContainerObjType, PureBaseContainerRewrite, "cRud", [ITPT_TAG_SPECIAL]);
}
