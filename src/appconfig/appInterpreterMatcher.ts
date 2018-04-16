import { DefaultItptMatcher } from "defaults/DefaultInterpreterMatcher";
import { IItptMatcher } from "ldaccess/iinterpreter-matcher";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultInterpreterRetriever";
import { appItptRetrFn } from "./appInterpreterRetriever";

class AppInterpreterMatcher extends DefaultItptMatcher {
}
var appItptMatcher: IItptMatcher = null;

export let appItptMatcherFn = (): IItptMatcher => {
	if (appItptMatcher == null) {
		appItptMatcher = new AppInterpreterMatcher();
		let defaultRetriever = appItptRetrFn();
		appItptMatcher.setItptRetriever(DEFAULT_ITPT_RETRIEVER_NAME, defaultRetriever);
	}
	return appItptMatcher;
};

//export default appItptMatcherFn;
