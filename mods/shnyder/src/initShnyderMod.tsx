import { ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc } from "./ImgHeadSubDescIntrprtr";
import { ITPT_TAG_ATOMIC, appItptRetrFn, IModStatus, SingleModStateKeysDict } from "@metaexplorer/core";
import { PureHeroGallery, HeroGalleryName } from "./hero-gallery";
import { PureTitleTextAndImage, TitleTextAndImageName } from "./TitleTextAndImage";
import { GooeyNavName, PureGooeyNav } from "./gooey-nav";
import { PureImprint, ImprintName } from "./compliance/imprint";
import { LayoutCircleDisplayName, PureCircleLayout } from "./circleview";

export const MOD_SHNYDER_ID = "SHNYDER_MOD";
export const MOD_SHNYDER_NAME = "Shnyder component Mod"

export function initShnyderMod() {
	let appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve) => {
		appIntRetr.addItpt(HeroGalleryName, PureHeroGallery, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(ImgHeadSubDescIntrprtrName, PureImgHeadSubDesc, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(TitleTextAndImageName, PureTitleTextAndImage, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(GooeyNavName, PureGooeyNav, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(ImprintName, PureImprint, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(LayoutCircleDisplayName, PureCircleLayout, "cRud", [ITPT_TAG_ATOMIC]);
		
		resolve({ id: MOD_SHNYDER_ID, name: MOD_SHNYDER_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
