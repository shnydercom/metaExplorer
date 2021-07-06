import { appItptRetrFn } from "../../appconfig/appItptRetriever";
import { ITPT_TAG_ATOMIC } from "../../ldaccess";
import { IRIMailtoFormatter, IRI_MAILTO_FORMATTER_TYPE } from "./mailto-formatter";

export function initIRIFormatter() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(IRI_MAILTO_FORMATTER_TYPE, IRIMailtoFormatter, "cRud", [ITPT_TAG_ATOMIC]);
}
