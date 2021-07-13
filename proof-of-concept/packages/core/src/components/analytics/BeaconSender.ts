import { appAnalyticsAPIFn } from "../../apis/analytics-api";
import { KVL } from "../../ldaccess/KVL";
import { BlueprintConfig, ldBlueprint } from "../../ldaccess/ldBlueprint";
import { LDDict } from "../../ldaccess/LDDict";
import { itptKeysFromInputKvs } from "../../ldaccess/ldUtils";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { LDRetrieverSuperRewrite } from "../../sidefx/LDRetrieverSuper-rewrite";
import { SideFXDict } from "../../sidefx/SideFXDict";

export const BeaconSenderName = "metaexplorer.io/analytics/BeaconSender";

export const BeaconSenderType = "metaexplorer.io/analytics/BeaconSenderType";

const TRIGGER = "trigger";

let inputKVStores: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.URL,
	},
	{
		key: UserDefDict.inputData,
		value: undefined,
		ldType: undefined,
	},
	{
		key: TRIGGER,
		value: undefined,
		ldType: undefined,
	},
];

let outputKVStores: KVL[] = [];

let ownKVLs = [...inputKVStores, ...outputKVStores];

let inKeys = itptKeysFromInputKvs(inputKVStores);
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: BeaconSenderName,
	ownKVLs: ownKVLs,
	inKeys,
	crudSkills: "cRud",
	canInterpretType: BeaconSenderType,
};

@ldBlueprint(bpCfg)
export class BeaconSender extends LDRetrieverSuperRewrite {
	lastStringified: string = "";
	constructor(parameters) {
		super(parameters, inKeys);
		this.apiCallOverride = () =>
			new Promise<any>((resolve, reject) => {
				let srvUrl = this.state.localValues.get(SideFXDict.srvURL);
				srvUrl = srvUrl ? srvUrl : "/api/log";
				const postBody = this.state.localValues.get(
					UserDefDict.inputData
				);
				appAnalyticsAPIFn(srvUrl).logBeacon(postBody);
			});
	}

	evalDirtyInput() {
		let triggerVal = this.state.localValues.get(TRIGGER);
		if (triggerVal) {
			const stringified = JSON.stringify(triggerVal);
			if (stringified === "{}" || stringified === this.lastStringified) {
				this.lastStringified = stringified;
				return;
			}
			this.lastStringified = stringified;
			this.setState({ ...this.state, isInputDirty: true });
			super.evalDirtyInput();
		}
	}
}
