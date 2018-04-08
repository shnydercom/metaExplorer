import { appIntRetrFn } from "appconfig/appInterpreterRetriever";
import { LDDict } from "ldaccess/LDDict";
import { PureImgDisplay } from "../imagedisplay-component";
import { PureBoolInput, PureIntInput, PureDoubleInput, PureTextInput, PureDateInput, PureDateTimeInput } from "../basedatatypeinterpreter/BaseDataTypeInput";
import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "../visualcomposition/ImgHeadSubDescIntrprtr";
import { PureNavBarWActions, NavBarWActionsName } from "../ywqd/navigation/NavBarWActions";
import { BottomNavigationName, PureBottomNavigation } from "../ywqd/navigation/BottomNavigation";
import { PureRouteComponent, RouteComponentName } from "../routing/route-component";
import { imageRetrieverName, ImageRetriever } from "sidefx/ImageRetriever";
import { productRetrieverName, ProductRetriever } from "sidefx/ProductRetriever";
import { organizationRetrieverName, OrganizationRetriever } from "sidefx/OrganizationRetriever";
import { PureRefMapIntrprtr } from "../generic/InterpreterReferenceMapType-component";
import { UserDefDict } from "ldaccess/UserDefDict";
import { PureRefMapItpt } from "../generic/RefMapItpt-component";

/**
 * sorry for the long function name //TODO: change
 */
export function initReactToolBoxRetrieverFnAsDefault() {
	let appIntRetr = appIntRetrFn();
	//appIntRetr.addItpt(LDDict.CreateAction, ImageUploadComponent, "Crud");
	appIntRetr.addItpt(LDDict.ViewAction, PureImgDisplay, "cRud");

	//register base data type inputs:
	appIntRetr.addItpt(LDDict.Boolean, PureBoolInput, "crud");
	appIntRetr.addItpt(LDDict.Integer, PureIntInput, "CRUd");
	appIntRetr.addItpt(LDDict.Double, PureDoubleInput, "CRUd");
	appIntRetr.addItpt(LDDict.Text, PureTextInput, "CRUd");
	appIntRetr.addItpt(LDDict.Date, PureDateInput, "CRUd");
	appIntRetr.addItpt(LDDict.DateTime, PureDateTimeInput, "CRUd");

	//register visual composition interpreters.
	appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud");
	appIntRetr.addItpt(NavBarWActionsName, PureNavBarWActions, "cRud");
	appIntRetr.addItpt(BottomNavigationName, PureBottomNavigation, "cRud");

	//register routing interpreters
	appIntRetr.addItpt(RouteComponentName, PureRouteComponent, "cRud");

	//register side effect-interpreter (these interpreters change the state asynchronously and are typically non-visual)
	appIntRetr.addItpt(imageRetrieverName, ImageRetriever, "cRud");
	appIntRetr.addItpt(productRetrieverName, ProductRetriever, "cRud");
	appIntRetr.addItpt(organizationRetrieverName, OrganizationRetriever, "cRud");

	//register generic interpreter for Designer-defined interpreters
	//appIntRetr.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapIntrprtr, "cRud"); //old version
	appIntRetr.addItpt(UserDefDict.intrprtrBPCfgRefMapType, PureRefMapItpt, "cRud"); //new version
}
