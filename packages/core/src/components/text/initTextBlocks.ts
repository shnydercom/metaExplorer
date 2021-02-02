import { ITPT_TAG_ATOMIC } from "../..";
import { appItptRetrFn } from "../../appconfig";
import { TextfillerBlock, TEXT_FILLER_TYPE } from "./templatefiller";

export function initTextBlocks() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(TEXT_FILLER_TYPE, TextfillerBlock, "cRud", [ITPT_TAG_ATOMIC]);
}
