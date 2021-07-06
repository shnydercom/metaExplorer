import { ITPT_TAG_ATOMIC } from "../..";
import { appItptRetrFn } from "../../appconfig";
import { MULTIPLICATION_TYPE, MultiplicationBlock, ADDITION_TYPE, AdditionBlock } from "./arithmetic";

export function initMathsBlocks() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(MULTIPLICATION_TYPE, MultiplicationBlock, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(ADDITION_TYPE, AdditionBlock, "cRud", [ITPT_TAG_ATOMIC]);
}
