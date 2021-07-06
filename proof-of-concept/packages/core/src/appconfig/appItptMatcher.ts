import { IItptMatcher } from "../ldaccess/iitpt-matcher";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "../defaults/DefaultItptRetriever";
import { appItptRetrFn } from "./appItptRetriever";
import { DefaultItptMatcher } from "./../defaults";

class AppItptMatcher extends DefaultItptMatcher {
}
var appItptMatcher: IItptMatcher = null;

export let appItptMatcherFn = (): IItptMatcher => {
	if (appItptMatcher == null) {
		appItptMatcher = new AppItptMatcher();
		let defaultRetriever = appItptRetrFn();
		appItptMatcher.setItptRetriever(DEFAULT_ITPT_RETRIEVER_NAME, defaultRetriever);
	}
	return appItptMatcher;
};
