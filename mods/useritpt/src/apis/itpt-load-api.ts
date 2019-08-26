import {
	BlueprintConfig, intrprtrTypeInstanceFromBlueprint, addBlueprintToRetriever, ILDOptions, NetworkPreferredToken, DEFAULT_ITPT_RETRIEVER_NAME,
	getApplicationStore, ldOptionsClientSideUpdateAction, isProduction, IAsyncRequestWrapper
} from "@metaexplorer/core";

export interface UserItptLoadResponse {
	itptMetaInfo: [{}];
	itptList: BlueprintConfig[];
	mainItpt: string;
}

export interface UserItptSetResponse extends IAsyncRequestWrapper {
	
}

export class UserItptLoadApi {

	public static getUserItptLoadApiSingleton(): UserItptLoadApi {
		if (UserItptLoadApi.apiSingleton == null) {
			UserItptLoadApi.apiSingleton = new UserItptLoadApi();
		}
		return UserItptLoadApi.apiSingleton;
	}

	private static apiSingleton: UserItptLoadApi;

	getItptsUnauthed(): () => Promise<UserItptLoadResponse> {
		return this.getItptsFrom(isProduction ? "/api/blocks" : "/api-static/interpreters.json");
	}
	getItptsFrom(targetUrl: string): () => Promise<UserItptLoadResponse> {
		return () => {
			return new Promise<UserItptLoadResponse>((resolve, reject) => {
				fetch(targetUrl, {
					method: 'GET',
					headers: {
						Accept: "application/json"
					},
				}
				).then((response) => {
					if (response.status >= 400) {
						reject("Bad response from server");
					}
					response.json().then((bodyVal) => {
						resolve(bodyVal as UserItptLoadResponse);
					}).catch((reason) => {
						reject(reason);
					});
				});
			});
		};
	}

	setItptsAt(targetUrl: string, postBodyJson): () => Promise<IAsyncRequestWrapper> {
		return () => {
			return new Promise<IAsyncRequestWrapper>((resolve, reject) => {
				fetch(targetUrl, {
					method: 'POST',
					headers: {
						Accept: "application/json",
						'Content-Type': 'application/json'
					},
					body: postBodyJson
				}
				).then((response) => {
					if (response.status >= 400) {
						reject("Bad response from server");
					}
					response.json().then((bodyVal) => {
						resolve(bodyVal as IAsyncRequestWrapper);
					}).catch((reason) => {
						reject(reason);
					});
				});
			})
		}
	}

	batchAdd = (input: BlueprintConfig[]) => {
		input.forEach((nodesBPCFG) => {
			addBlueprintToRetriever(nodesBPCFG);
		});
	}
	generateDummy = (blueprintCfg: BlueprintConfig, ldTokenString: string, kvKey: string) => {
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(blueprintCfg);
		let newType = blueprintCfg.canInterpretType;
		let newLDOptions: ILDOptions = {
			isLoading: false,
			lang: undefined,
			ldToken: new NetworkPreferredToken(ldTokenString),
			resource: {
				webInResource: undefined,
				webOutResource: undefined,
				kvStores: [
					{ key: kvKey, ldType: newType, value: dummyInstance }
				]
			},
			visualInfo: {
				retriever: DEFAULT_ITPT_RETRIEVER_NAME
			}
		};
		getApplicationStore().dispatch(ldOptionsClientSideUpdateAction(newLDOptions));
	}
}
