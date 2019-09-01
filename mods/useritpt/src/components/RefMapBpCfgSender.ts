import {
	LDRetrieverSuperRewrite, IKvStore, itptKeysFromInputKvs, ldBlueprint, BlueprintConfig, LDDict, UserDefDict, SideFXDict
	, IAsyncRequestWrapper
} from "@metaexplorer/core";
import { UserItptLoadApi } from "../apis/itpt-load-api";

export const RefMapBpCfgSenderName = "metaexplorer.io/v1/RefMapBpCfgSender";

export const RefMapBpCfgSenderType = "metaexplorer.io/v1/RefMapBpCfgSenderType";

export const inputRefMap = "inputRefMap";

let inputKVStores: IKvStore[] = [
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

let outputKVStores: IKvStore[] = [
	{
		key: UserDefDict.responseWrapperKey,
		value: undefined,
		ldType: UserDefDict.responseWrapperType
	},
];

let initialKVStores = [...inputKVStores, ...outputKVStores];

let interpretableKeys = itptKeysFromInputKvs(inputKVStores);
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: RefMapBpCfgSenderName,
	initialKvStores: initialKVStores,
	interpretableKeys,
	crudSkills: "cRud",
	canInterpretType: RefMapBpCfgSenderType
};

@ldBlueprint(bpCfg)
export class RefMapBpCfgSender extends LDRetrieverSuperRewrite {
	constructor(parameters) {
		super(parameters, interpretableKeys);
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
