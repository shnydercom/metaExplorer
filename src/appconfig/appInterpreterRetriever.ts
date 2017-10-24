import { DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";

import { LDDict } from "ldaccess/LDDict";

class AppInterpreterRetriever extends DefaultInterpreterRetriever{

}

var appIntRetr: IInterpreterRetriever = null;
//appIntRetr.addInterpreter(LDDict.CreateAction, ImageUploadComponent, "Crud");
//appIntRetr.addInterpreter(LDDict.ImageObject, ImageDisplayComponent, "cRud");

export let appIntRetrFn = (): IInterpreterRetriever => {
	if (appIntRetr == null){
		appIntRetr = new AppInterpreterRetriever();
	}
	console.dir(appIntRetr);
	return appIntRetr;
};

export default appIntRetrFn;
