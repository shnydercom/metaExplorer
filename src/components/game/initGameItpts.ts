import { appItptRetrFn } from "appconfig/appItptRetriever";
import { PureFourFieldsView } from "./fourfieldsview";
import { GAME_4F_TYPE } from "./game-constants";
import { SingleFieldViewIntrprtrName, PureSingleFieldView } from "./singlefield";

export function initGameItpt() {
	let appIntRetr = appItptRetrFn();
	appIntRetr.addItpt(GAME_4F_TYPE, PureFourFieldsView, "cRud");
	appIntRetr.addItpt(SingleFieldViewIntrprtrName, PureSingleFieldView, "cRud");
}
