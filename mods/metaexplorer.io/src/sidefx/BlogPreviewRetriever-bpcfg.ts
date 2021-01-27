import {
	KVL,
	BlueprintConfig,
	LDServiceSchemaDict,
	LDDict,
	UserDefDict,
	itptKeysFromInputKvs,
	SideFXDict,
} from "@metaexplorer/core";

const NAME_SELF = "metaexplorer.io/BlogPreviewRetriever";

const IN_KVLS: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.URL
	},
	{
		key: LDServiceSchemaDict.WordpressInstallationURL,
		value: undefined,
		ldType: LDDict.URL,
	},
	{
		key: LDServiceSchemaDict.WordpressCategory,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: SideFXDict.trigger,
		value: undefined,
		ldType: undefined
	}
];

const OUT_KVLS: KVL[] = [
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: LDDict.Blog,
	},
];

export const IN_KEYS = itptKeysFromInputKvs(IN_KVLS);

const OWN_KVLS = [...IN_KVLS, ...OUT_KVLS];

const BP_CFG: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NAME_SELF,
	ownKVLs: OWN_KVLS,
	inKeys: IN_KEYS,
	crudSkills: "cRud",
};

export default BP_CFG;
