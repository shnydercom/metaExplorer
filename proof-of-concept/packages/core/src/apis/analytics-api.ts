class AnalyticsAPI {
	logUrl: string;
	constructor(logUrl: string) {
		this.logUrl = logUrl;
		this.setupSessionStartListener();
	}
	setupSessionEndListener() {
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				this.logBeacon({
					[LOG_SOURCE_ID]: "document",
					[LOG_EVENT_TYPE]: "visibilitychange",
					[LOG_EVENT_VALUE]: "hidden",
				});
			}
		});
	}
	private setupSessionStartListener() {
		this.logBeacon({
			[LOG_SOURCE_ID]: "analyticsAPI",
			[LOG_EVENT_TYPE]: "status",
			[LOG_EVENT_VALUE]: "available",
		});
	}
	logBeacon(data) {
		const dataHistoryBlob = new Blob([JSON.stringify(data)], {
			type: "application/json",
		});
		navigator.sendBeacon(this.logUrl, dataHistoryBlob);
	}
}

var appAnalyticsAPI: AnalyticsAPI = null;

/**
 * singleton to access the Analytics API. Initializes on first call, default endpoint: /api/log
 * */
export let appAnalyticsAPIFn = (logUrl?: string): AnalyticsAPI => {
	if (appAnalyticsAPI == null) {
		appAnalyticsAPI = new AnalyticsAPI(logUrl || "/api/log");
	}
	return appAnalyticsAPI;
};

export const LOG_SOURCE_ID = "sourceId";
export const LOG_EVENT_TYPE = "eventType";
export const LOG_EVENT_VALUE = "eventValue";
