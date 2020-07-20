import {
	LDRetrieverSuperRewrite, KVL, itptKeysFromInputKvs, ldBlueprint, BlueprintConfig, LDDict, UserDefDict, SideFXDict
	, IAsyncRequestWrapper
} from "@metaexplorer/core";
import { UserItptLoadApi } from "../apis/itpt-load-api";

export const RefMapBpCfgSenderName = "metaexplorer.io/server/RefMapBpCfgSender";

export const RefMapBpCfgSenderType = "metaexplorer.io/server/RefMapBpCfgSenderType";

export const inputRefMap = "inputRefMap";

let inputKVStores: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.URL
	},
	{
		key: inputRefMap,
		value: undefined,
		ldType: UserDefDict.itptRefMapBpCfg
	}
];

let outputKVStores: KVL[] = [
	{
		key: UserDefDict.responseWrapperKey,
		value: undefined,
		ldType: UserDefDict.responseWrapperType
	},
];

let ownKVLs = [...inputKVStores, ...outputKVStores];

let inKeys = itptKeysFromInputKvs(inputKVStores);
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: RefMapBpCfgSenderName,
	ownKVLs: ownKVLs,
	inKeys,
	crudSkills: "cRud",
	canInterpretType: RefMapBpCfgSenderType
};

@ldBlueprint(bpCfg)
export class RefMapBpCfgSender extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, inKeys);
		this.apiCallOverride = () => new Promise<any>((resolve, reject) => {
			const srvUrl = this.state.localValues.get(SideFXDict.srvURL);
			const postBody = this.state.localValues.get(inputRefMap);
			const promise = UserItptLoadApi.getUserItptLoadApiSingleton().setItptsAt(srvUrl, postBody);
			promise().then(response =>
				resolve(
					this.wrapOutputKv(response)
				)
			).catch(
				reason => resolve(this.wrapOutputKv(
					{
						status: 'error',
						message: reason,
						statusPayload: "error"
					})
				)
			)
		});
	}

	protected wrapOutputKv (inputBody: IAsyncRequestWrapper): any {
		return {
			 [UserDefDict.responseWrapperKey]: inputBody
		}
	}

}
