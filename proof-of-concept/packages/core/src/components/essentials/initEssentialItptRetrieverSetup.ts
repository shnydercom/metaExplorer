import { appItptRetrFn } from "../../appconfig/appItptRetriever";
import { LDDict } from "../../ldaccess/LDDict";
import { PureImgDisplay } from "../visualcomposition/imagedisplay-component";
import { PureRouteComponent, RouteComponentName } from "../routing/route-component";
import { imageRetrieverName, ImageRetriever } from "../../sidefx/ImageRetriever";
import { productRetrieverName, ProductRetriever } from "../../sidefx/ProductRetriever";
import { organizationRetrieverName, OrganizationRetriever } from "../../sidefx/OrganizationRetriever";
import { ITPT_TAG_ATOMIC } from "../../ldaccess/iitpt-retriever";
import { LayoutVHCenteredColumnName, PureVHcenteredColumnLayout,  } from "../layout/layoutBaseComp";
import { PureRedirectComponent, RouteRedirectName } from "../routing/redirect";
import { TwoDtoJSONArray, TwoDtoJSONArrayName } from "../../datatransformation/TwoDtoJSONArray";
import { JSONArrayToCompactInfoArrayName, JSONArrayToCompactInfoArray } from "../../datatransformation/JSONArrayToCompactInfoArray";
import { CSSWrapperName, PureCSSWrapper } from "../../components/layout/CSSWrapper";
import { PureVideoDisplay } from "../visualcomposition";

export function initEssentialInterpreters() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(LDDict.ImageObject, PureImgDisplay, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(LDDict.VideoObject, PureVideoDisplay, "cRud", [ITPT_TAG_ATOMIC]);

	//register routing itpts
	appIntRetr.addItpt(RouteComponentName, PureRouteComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(RouteRedirectName, PureRedirectComponent, "cRud", [ITPT_TAG_ATOMIC]);

	//register side effect-itpt (these itpts change the state asynchronously and are typically non-visual)
	appIntRetr.addItpt(imageRetrieverName, ImageRetriever, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(productRetrieverName, ProductRetriever, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(organizationRetrieverName, OrganizationRetriever, "cRud", [ITPT_TAG_ATOMIC]);

	//register layout itpts
	appIntRetr.addItpt(LayoutVHCenteredColumnName, PureVHcenteredColumnLayout, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(CSSWrapperName, PureCSSWrapper, "cRud", [ITPT_TAG_ATOMIC]);

	//data transformation itpts
	appIntRetr.addItpt(TwoDtoJSONArrayName, TwoDtoJSONArray, "cRUd", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(JSONArrayToCompactInfoArrayName, JSONArrayToCompactInfoArray, "cRUD", [ITPT_TAG_ATOMIC]);
}
