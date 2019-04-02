import { appItptRetrFn } from "appconfig/appItptRetriever";
import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "./ImgHeadSubDescIntrprtr";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { PureHeroGallery, HeroGalleryName } from "./hero-gallery";
import TitleTextAndImage, { TitleTextAndImageName } from "./TitleTextAndImage";
import { GooeyNavName, PureGooeyNav } from "./gooey-nav";
import { PureImprint, ImprintName } from "./compliance/imprint";

export function initShnyderItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(HeroGalleryName, PureHeroGallery, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(TitleTextAndImageName, TitleTextAndImage, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(GooeyNavName, PureGooeyNav, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ImprintName, PureImprint, "cRud", [ITPT_TAG_ATOMIC]);
}
