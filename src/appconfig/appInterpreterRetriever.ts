import { IItptRetriever } from "ldaccess/iinterpreter-retriever";

import { LDDict } from "ldaccess/LDDict";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxInterpreterRetriever";

class AppInterpreterRetriever extends ReduxItptRetriever{

}

var appIntRetr: IItptRetriever = null;
//appIntRetr.addInterpreter(LDDict.CreateAction, ImageUploadComponent, "Crud");
//appIntRetr.addInterpreter(LDDict.ImageObject, ImageDisplayComponent, "cRud");

export let appIntRetrFn = (): IItptRetriever => {
	if (appIntRetr == null){
		appIntRetr = new AppInterpreterRetriever();
	}
	return appIntRetr;
};

export default appIntRetrFn;
