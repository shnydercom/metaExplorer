import { ANALYTICS_HR_NAME, PureHRAnalyticsComponent } from ".";
import { flatDataTypeAssemblerFactory, ITPT_TAG_ATOMIC, KVL, LDDict } from "../..";
import { LOG_SOURCE_ID, LOG_EVENT_TYPE, LOG_EVENT_VALUE } from "../../apis/analytics-api";
import { appItptRetrFn } from "../../appconfig/appItptRetriever";
import { BeaconSender, BeaconSenderName } from "./BeaconSender";

export function initAnalyticsItpt() {
	let appIntRetr = appItptRetrFn();
	let logEventAssemblerName = "metaexplorer.io/analytics/logAssembler";
	let logEventKvs: KVL[] = [
		{
			key: LOG_SOURCE_ID,
			value: null,
			ldType: LDDict.Text,
		},
		{
			key: LOG_EVENT_TYPE,
			value: null,
			ldType: LDDict.Text,
		},
		{
			key: LOG_EVENT_VALUE,
			value: null,
			ldType: LDDict.Text,
		},
	];
	let logEventAssemblerComp = flatDataTypeAssemblerFactory(
		logEventKvs,
		logEventAssemblerName
	);
	appIntRetr.addItpt(logEventAssemblerName, logEventAssemblerComp, "CRud", [
		ITPT_TAG_ATOMIC,
	]);
	appIntRetr.addItpt(ANALYTICS_HR_NAME, PureHRAnalyticsComponent, "cRud", [
		ITPT_TAG_ATOMIC,
	]);
	appIntRetr.addItpt(BeaconSenderName, BeaconSender, "cRud", [ITPT_TAG_ATOMIC]);
}
