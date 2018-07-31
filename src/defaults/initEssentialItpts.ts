import { appItptRetrFn } from "appconfig/appItptRetriever";
import { PureRefMapItpt } from "components/generic/RefMapItpt-component";
import { UserDefDict } from "ldaccess/UserDefDict";
import { PureBaseContainerRewrite } from "components/generic/baseContainer-rewrite";

export function initEssentialItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud");
	appIntRetr.addItpt(UserDefDict.itptContainerObjType, PureBaseContainerRewrite, "cRud");
}
