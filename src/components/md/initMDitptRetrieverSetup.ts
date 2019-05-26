import { appItptRetrFn } from "appconfig/appItptRetriever";
import { LDDict } from "ldaccess/LDDict";
import { PureImgDisplay } from "../visualcomposition/imagedisplay-component";
import { PureNavBarWActions, NavBarWActionsName } from "../md/navigation/NavBarWActions";
import { BottomNavigationName, PureBottomNavigation, TopNavigationName, PureTopNavigation } from "./navigation/NavWMax5Choices";
import { PureRouteComponent, RouteComponentName } from "../routing/route-component";
import { imageRetrieverName, ImageRetriever } from "sidefx/ImageRetriever";
import { productRetrieverName, ProductRetriever } from "sidefx/ProductRetriever";
import { organizationRetrieverName, OrganizationRetriever } from "sidefx/OrganizationRetriever";
import { EANScannerName, EANScanner } from "../peripherals/camera/EAN-scanner";
import { SingleImageSelectorName, PureSingleImageSelector } from "../md/content/SingleImageSelector";
import { NavSearchBarName, PureNavSearchBar } from "../md/navigation/NavSearchBar";
import { NavProcessAtomName, PureNavProcessAtom } from "./navigation/NavProcessAtom";
import { PureMDButton } from "./interaction/AbstractButton";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { LayoutVHCenteredColumnName, PureVHcenteredColumnLayout, PureCircleLayout, LayoutCircleDisplayName } from "../layout/layoutBaseComp";
import { PureRedirectComponent, RouteRedirectName } from "../routing/redirect";
import { PureCard3itptLTR, Card3itptLTRName } from "./interaction/AbstractCardW3Containers";
import { TwoDtoJSONArray, TwoDtoJSONArrayName } from "datatransformation/TwoDtoJSONArray";
import { PureSimpleTextTable, SimpleTextTableName } from "./content/SimpleTextTable";
import { JSONArrayToCompactInfoArrayName, JSONArrayToCompactInfoArray } from "datatransformation/JSONArrayToCompactInfoArray";
import { NavBarInputContainerName, PureNavBarInputContainer } from "./navigation/NavBarInputContainer";
import { CSSWrapperName, PureCSSWrapper } from "components/layout/CSSWrapper";

/**
 * sorry for the long function name //TODO: change
 */
export function initMDitptFnAsDefault() {
	let appIntRetr = appItptRetrFn();
	//appIntRetr.addItpt(LDDict.CreateAction, ImageUploadComponent, "Crud");
	appIntRetr.addItpt(LDDict.ViewAction, PureImgDisplay, "cRud", [ITPT_TAG_ATOMIC]);

	//register visual composition itpts.
	appIntRetr.addItpt(NavBarInputContainerName, PureNavBarInputContainer, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(NavBarWActionsName, PureNavBarWActions, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(BottomNavigationName, PureBottomNavigation, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(TopNavigationName, PureTopNavigation, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(NavSearchBarName, PureNavSearchBar, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(NavProcessAtomName, PureNavProcessAtom, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(Card3itptLTRName, PureCard3itptLTR, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(SimpleTextTableName, PureSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

	//register routing itpts
	appIntRetr.addItpt(RouteComponentName, PureRouteComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(RouteRedirectName, PureRedirectComponent, "cRud", [ITPT_TAG_ATOMIC]);

	//register Action itpts
	appIntRetr.addItpt(LDDict.Action, PureMDButton, "cRud", [ITPT_TAG_ATOMIC]);

	//register side effect-itpt (these itpts change the state asynchronously and are typically non-visual)
	appIntRetr.addItpt(imageRetrieverName, ImageRetriever, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(productRetrieverName, ProductRetriever, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(organizationRetrieverName, OrganizationRetriever, "cRud", [ITPT_TAG_ATOMIC]);

	//register shnyder-itpt
	appIntRetr.addItpt(EANScannerName, EANScanner, "cRud", [ITPT_TAG_ATOMIC]); //new version
	appIntRetr.addItpt(SingleImageSelectorName, PureSingleImageSelector, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(LayoutVHCenteredColumnName, PureVHcenteredColumnLayout, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(LayoutCircleDisplayName, PureCircleLayout, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(CSSWrapperName, PureCSSWrapper, "cRud", [ITPT_TAG_ATOMIC]);


	//data transformation itpts
	appIntRetr.addItpt(TwoDtoJSONArrayName, TwoDtoJSONArray, "cRUd", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(JSONArrayToCompactInfoArrayName, JSONArrayToCompactInfoArray, "cRUD", [ITPT_TAG_ATOMIC]);
}
