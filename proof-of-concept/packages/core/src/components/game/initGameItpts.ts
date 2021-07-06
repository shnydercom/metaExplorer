import { appItptRetrFn } from "../../appconfig/appItptRetriever";
import { PureFourFieldsView } from "./fourfieldsview";
import { GAME_4F_TYPE } from "./game-constants";
import { SingleFieldViewIntrprtrName, PureSingleFieldView } from "./singlefield";
import { ITPT_TAG_ATOMIC } from "../../ldaccess/iitpt-retriever";

export function initGameItpt() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(GAME_4F_TYPE, PureFourFieldsView, "cRud", [ITPT_TAG_ATOMIC]);
	appIntRetr.addItpt(SingleFieldViewIntrprtrName, PureSingleFieldView, "cRud", [ITPT_TAG_ATOMIC]);
}
