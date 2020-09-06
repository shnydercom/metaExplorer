import {
	IAsyncRequestWrapper
} from "@metaexplorer/core";

export interface EditorGlobalsLoadResponse {
	[s: string]: any;
}

export interface EditorGlobalsSetResponse extends IAsyncRequestWrapper {

}

export class EditorGlobalsLoadApi {

	public static getEditorGlobalsLoadApiSingleton(): EditorGlobalsLoadApi {
		if (EditorGlobalsLoadApi.apiSingleton == null) {
			EditorGlobalsLoadApi.apiSingleton = new EditorGlobalsLoadApi();
		}
		return EditorGlobalsLoadApi.apiSingleton;
	}

	private static apiSingleton: EditorGlobalsLoadApi;

	getGlobalsFrom(targetUrl: string): () => Promise<EditorGlobalsLoadResponse> {
		return () => {
			return new Promise<EditorGlobalsLoadResponse>((resolve, reject) => {
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
						resolve(bodyVal as EditorGlobalsLoadResponse);
					}).catch((reason) => {
						reject(reason);
					});
				});
			});
		};
	}

	setGlobalsAt(targetUrl: string, postBodyJson): () => Promise<IAsyncRequestWrapper> {
		return () => {
			return new Promise<IAsyncRequestWrapper>((resolve, reject) => {
				let bodyJson = postBodyJson;
				try {
					bodyJson = JSON.stringify(bodyJson);
				} catch (error) {
					reject(error);
				}
				fetch(targetUrl, {
					method: 'POST',
					headers: {
						"Accept": "application/json",
						'Content-Type': 'application/json'
					},
					body: bodyJson
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
			});
		};
	}
}
