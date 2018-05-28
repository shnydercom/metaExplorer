import { IItptRetriever } from "ldaccess/iItpt-retriever";

import { LDDict } from "ldaccess/LDDict";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";

class AppItptRetriever extends ReduxItptRetriever{

}

var appIntRetr: IItptRetriever = null;

export let appItptRetrFn = (): IItptRetriever => {
	if (appIntRetr == null){
		appIntRetr = new AppItptRetriever();
	}
	return appIntRetr;
};

export default appItptRetrFn;
