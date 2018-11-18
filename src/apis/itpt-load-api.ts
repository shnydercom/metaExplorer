import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { intrprtrTypeInstanceFromBlueprint, addBlueprintToRetriever } from "appconfig/retrieverAccessFns";
import { ILDOptions } from "ldaccess/ildoptions";
import { NetworkPreferredToken } from "ldaccess/ildtoken";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { applicationStore } from "approot";
import { ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";

export interface ItptLoadResponse {
	itptMetaInfo: [{}];
	itptList: BlueprintConfig[];
}

export class ItptLoadApi {
	getItptsForCurrentUser(): () => Promise<ItptLoadResponse> {
		return this.getItptsFrom("/static/interpreters.json");
	}
	getItptsFrom(targetUrl: string): () => Promise<ItptLoadResponse> {
		return () => {
			return new Promise<ItptLoadResponse>((resolve, reject) => {
				fetch(targetUrl, {
					method: 'GET',
					headers: {
						Accept: "application/json"
					},
					/*
					mode: 'cors',
					cache: 'default'*/
				}
				).then((response) => {
					if (response.status >= 400) {
						reject("Bad response from server");
					}
					response.json().then((bodyVal) => {
						resolve(bodyVal as ItptLoadResponse);
					}).catch((reason) => {
						reject(reason);
					});
				});
			});
		};
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
		applicationStore.dispatch(ldOptionsClientSideUpdateAction(newLDOptions));
	}
}
