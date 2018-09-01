import { appItptRetrFn } from "appconfig/appItptRetriever";
import { LDDict } from "ldaccess/LDDict";
import { PureImgDisplay } from "../imagedisplay-component";
import { PureBoolInput, PureIntInput, PureDoubleInput, PureTextInput, PureDateInput, PureDateTimeInput } from "../md/content/BaseDataTypeInput";
import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "../visualcomposition/ImgHeadSubDescIntrprtr";
import { PureNavBarWActions, NavBarWActionsName } from "../md/navigation/NavBarWActions";
import { BottomNavigationName, PureBottomNavigation } from "../md/navigation/BottomNavigation";
import { PureRouteComponent, RouteComponentName } from "../routing/route-component";
import { imageRetrieverName, ImageRetriever } from "sidefx/ImageRetriever";
import { productRetrieverName, ProductRetriever } from "sidefx/ProductRetriever";
import { organizationRetrieverName, OrganizationRetriever } from "sidefx/OrganizationRetriever";
import { UserDefDict } from "ldaccess/UserDefDict";
import { EANScannerName, EANScanner } from "../peripherals/camera/EAN-scanner";
import { SingleImageSelectorName, PureSingleImageSelector } from "../md/content/SingleImageSelector";
import { NavSearchBarName, PureNavSearchBar } from "../md/navigation/NavSearchBar";
import { NavProcessAtomName, PureNavProcessAtom } from "./navigation/NavProcessAtom";

/**
 * sorry for the long function name //TODO: change
 */
export function initMDitptFnAsDefault() {
	let appIntRetr = appItptRetrFn();
	//appIntRetr.addItpt(LDDict.CreateAction, ImageUploadComponent, "Crud");
	appIntRetr.addItpt(LDDict.ViewAction, PureImgDisplay, "cRud");

	//register base data type inputs:
	appIntRetr.addItpt(LDDict.Boolean, PureBoolInput, "crud");
	appIntRetr.addItpt(LDDict.Integer, PureIntInput, "CRUd");
	appIntRetr.addItpt(LDDict.Double, PureDoubleInput, "CRUd");
	appIntRetr.addItpt(LDDict.Text, PureTextInput, "CRUd");
	appIntRetr.addItpt(LDDict.Date, PureDateInput, "CRUd");
	appIntRetr.addItpt(LDDict.DateTime, PureDateTimeInput, "CRUd");

	//register visual composition itpts.
	appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud");
	appIntRetr.addItpt(NavBarWActionsName, PureNavBarWActions, "cRud");
	appIntRetr.addItpt(BottomNavigationName, PureBottomNavigation, "cRud");
	appIntRetr.addItpt(NavSearchBarName, PureNavSearchBar, "cRud");
	appIntRetr.addItpt(NavProcessAtomName, PureNavProcessAtom, "cRud");

	//register routing itpts
	appIntRetr.addItpt(RouteComponentName, PureRouteComponent, "cRud");

	//register side effect-itpt (these itpts change the state asynchronously and are typically non-visual)
	appIntRetr.addItpt(imageRetrieverName, ImageRetriever, "cRud");
	appIntRetr.addItpt(productRetrieverName, ProductRetriever, "cRud");
	appIntRetr.addItpt(organizationRetrieverName, OrganizationRetriever, "cRud");

	//register shnyder-itpt
	appIntRetr.addItpt(EANScannerName, EANScanner, "cRud"); //new version
	appIntRetr.addItpt(SingleImageSelectorName, PureSingleImageSelector, "cRud");
}
