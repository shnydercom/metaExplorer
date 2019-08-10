import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "./ImgHeadSubDescIntrprtr";
import { ITPT_TAG_ATOMIC, PureCircleLayout, LayoutCircleDisplayName, appItptRetrFn } from "@metaexplorer/core";
import { PureHeroGallery, HeroGalleryName } from "./hero-gallery";
import { PureTitleTextAndImage, TitleTextAndImageName } from "./TitleTextAndImage";
import { GooeyNavName, PureGooeyNav } from "./gooey-nav";
import { PureImprint, ImprintName } from "./compliance/imprint";

export function initShnyderItpts() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(HeroGalleryName, PureHeroGallery, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(TitleTextAndImageName, PureTitleTextAndImage, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(GooeyNavName, PureGooeyNav, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ImprintName, PureImprint, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(LayoutCircleDisplayName, PureCircleLayout, "cRud", [ITPT_TAG_ATOMIC]);
}
