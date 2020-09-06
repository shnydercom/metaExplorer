import {
	LDRetrieverSuperRewrite, KVL, itptKeysFromInputKvs, ldBlueprint, BlueprintConfig, LDDict, UserDefDict, SideFXDict
} from "@metaexplorer/core";
import { EditorGlobalsLoadApi } from "./EditorGlobalsAPI";

export const EditorGlobalsRetrieverName = "metaexplorer.io/v1/server/EditorGlobalsRetriever";

export const EditorGlobalsRetrieverType = "metaexplorer.io/v1/server/EditorGlobalsRetrieverType";

let inputKVStores: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.URL
	},
	{
		key: "trigger",
		value: undefined,
		ldType: undefined
	}
];

let outputKVStores: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: undefined
	},
];

let ownKVLs = [...inputKVStores, ...outputKVStores];

let inKeys = itptKeysFromInputKvs(inputKVStores);
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: EditorGlobalsRetrieverName,
	ownKVLs: ownKVLs,
	inKeys,
	crudSkills: "cRud",
	canInterpretType: EditorGlobalsRetrieverType
};

@ldBlueprint(bpCfg)
export class EditorGlobalsRetriever extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, inKeys);
		this.apiCallOverride = () => new Promise<any>((resolve) => {
			let srvUrl = this.state.localValues.get(SideFXDict.srvURL);
			srvUrl = srvUrl ? srvUrl : '/api/globals';
			const promise = EditorGlobalsLoadApi.getEditorGlobalsLoadApiSingleton().getGlobalsFrom(srvUrl);
			promise().then((response) => {
				resolve(this.wrapOutputKv(response));
			}
			).catch(
				(reason) => resolve(this.wrapOutputKv(
					{
						status: 'error',
						message: reason,
						statusPayload: "error"
					})
				)
			);
		});
	}

	protected wrapOutputKv(inputBody: any): any {
		return {
			[UserDefDict.outputData]: inputBody
		};
	}

}
