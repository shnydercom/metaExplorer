import { appItptRetrFn } from "appconfig/appItptRetriever";
import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "./ImgHeadSubDescIntrprtr";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { PureHeroGallery, HeroGalleryName } from "./hero-gallery";

export function initShnyderItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(HeroGalleryName, PureHeroGallery, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud", [ITPT_TAG_ATOMIC]);
}
