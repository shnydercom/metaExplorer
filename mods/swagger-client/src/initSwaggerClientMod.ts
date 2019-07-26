import appItptRetrFn from "appconfig/appItptRetriever";
import { SwaggerClientAPI } from "./apis/swagger-client";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";

export const MOD_SWAGGER_ID = "swagger";
export const MOD_SWAGGER_NAME = "OpenAPI Mod";

export function initSwaggerClientMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		SwaggerClientAPI.getSwaggerAPISingleton().then((a) => {
			a.addAllItpts(appIntRetr);
			resolve({ id: MOD_SWAGGER_ID, name: MOD_SWAGGER_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null});
		}).catch((reason) => {
			reject(reason);
		});
	} );
	return rv;
}
