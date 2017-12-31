import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";

import { LDDict } from "ldaccess/LDDict";
import { ReduxInterpreterRetriever } from "ld-react-redux-connect/ReduxInterpreterRetriever";

class AppInterpreterRetriever extends ReduxInterpreterRetriever{

}

var appIntRetr: IInterpreterRetriever = null;
//appIntRetr.addInterpreter(LDDict.CreateAction, ImageUploadComponent, "Crud");
//appIntRetr.addInterpreter(LDDict.ImageObject, ImageDisplayComponent, "cRud");

export let appIntRetrFn = (): IInterpreterRetriever => {
	if (appIntRetr == null){
		appIntRetr = new AppInterpreterRetriever();
	}
	return appIntRetr;
};

export default appIntRetrFn;
