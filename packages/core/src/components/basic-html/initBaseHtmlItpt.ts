import { appItptRetrFn } from "../../appconfig/appItptRetriever";
import { ITPT_TAG_ATOMIC } from "../../ldaccess/iitpt-retriever";
import {
	PureParagraphTextComponent, PureItalicsTextComponent, PureBoldTextComponent, PureSpanTextComponent,
	PureH4TextComponent, PureH3TextComponent, PureH2TextComponent, PureH1TextComponent, ParagraphTextComponentName,
	ItalicsTextComponentName, BoldTextComponentName, SpanTextComponentName, H4TextComponentName, H3TextComponentName,
	H2TextComponentName, H1TextComponentName
} from "./text-based-components";
import { PureIFrameComponent, CORE_IFRAME_CFG } from "./iframe";

export function initBaseHtmlItpt() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(ParagraphTextComponentName, PureParagraphTextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ItalicsTextComponentName, PureItalicsTextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(BoldTextComponentName, PureBoldTextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(SpanTextComponentName, PureSpanTextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(H4TextComponentName, PureH4TextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(H3TextComponentName, PureH3TextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(H2TextComponentName, PureH2TextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(H1TextComponentName, PureH1TextComponent, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(CORE_IFRAME_CFG.canInterpretType, PureIFrameComponent, "cRud", [ITPT_TAG_ATOMIC]);
}
