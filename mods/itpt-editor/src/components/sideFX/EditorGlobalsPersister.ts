import {
	LDRetrieverSuperRewrite, KVL, itptKeysFromInputKvs, ldBlueprint, BlueprintConfig, LDDict, UserDefDict, SideFXDict
	, IAsyncRequestWrapper
} from "@metaexplorer/core";
import { EditorGlobalsLoadApi } from "./EditorGlobalsAPI";

export const EditorGlobalsPersisterName = "metaexplorer.io/v1/server/EditorGlobalsPersister";

export const EditorGlobalsPersisterType = "metaexplorer.io/v1/server/EditorGlobalsPersisterType";

let inputKVStores: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.URL
	},
	{
		key: UserDefDict.inputData,
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
	nameSelf: EditorGlobalsPersisterName,
	ownKVLs: ownKVLs,
	inKeys,
	crudSkills: "cRud",
	canInterpretType: EditorGlobalsPersisterType
};

@ldBlueprint(bpCfg)
export class EditorGlobalsPersister extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, inKeys);
		this.apiCallOverride = () => new Promise<any>((resolve, reject) => {
			let srvUrl = this.state.localValues.get(SideFXDict.srvURL);
			srvUrl = srvUrl ? srvUrl : '/api/globals';
			const postBody = this.state.localValues.get(UserDefDict.inputData);
			const promise = EditorGlobalsLoadApi.getEditorGlobalsLoadApiSingleton().setGlobalsAt(srvUrl, postBody);
			promise().then((response) =>
				resolve(
					this.wrapOutputKv(response)
				)
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

	protected wrapOutputKv(inputBody: IAsyncRequestWrapper): any {
		return {
			 [UserDefDict.responseWrapperKey]: inputBody
		};
	}

}
