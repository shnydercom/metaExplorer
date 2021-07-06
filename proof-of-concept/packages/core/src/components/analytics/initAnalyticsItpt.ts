import { ANALYTICS_HR_NAME, PureHRAnalyticsComponent } from ".";
import { ITPT_TAG_ATOMIC } from "../..";
import { appItptRetrFn } from "../../appconfig/appItptRetriever";

export function initAnalyticsItpt() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(ANALYTICS_HR_NAME, PureHRAnalyticsComponent, "cRud", [ITPT_TAG_ATOMIC]);
}
