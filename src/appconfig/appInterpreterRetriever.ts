import { DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";

//import ImageUploadComponent from 'components/imageupload-component';
//import ImageDisplayComponent from 'components/imagedisplay-component';
import { LDDict } from "ldaccess/LDDict";

class AppInterpreterRetriever extends DefaultInterpreterRetriever{

}

const appIntRetr: IInterpreterRetriever = new AppInterpreterRetriever();
//appIntRetr.addInterpreter(LDDict.CreateAction, ImageUploadComponent, "Crud");
//appIntRetr.addInterpreter(LDDict.ImageObject, ImageDisplayComponent, "cRud");
export default appIntRetr;
