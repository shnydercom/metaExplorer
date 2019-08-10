import { IItptRetriever } from "../ldaccess/iitpt-retriever";

import { ReduxItptRetriever } from "../ld-react-redux-connect/ReduxItptRetriever";

class AppItptRetriever extends ReduxItptRetriever{

}

var appIntRetr: IItptRetriever = null;

export let appItptRetrFn = (): IItptRetriever => {
	if (appIntRetr == null){
		appIntRetr = new AppItptRetriever();
	}
	return appIntRetr;
};
