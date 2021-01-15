import {
	KVL,
	BlueprintConfig,
	LDServiceSchemaDict,
    LDDict,
    UserDefDict
} from "@metaexplorer/core";

const NAME_SELF = "metaexplorer.io/BlogPreviewRetriever";

const IN_KEYS: string[] = [
	LDServiceSchemaDict.WordpressInstallationURL,
	LDServiceSchemaDict.WordpressCategory,
];

const OWN_KVLS: KVL[] = [
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
        key: UserDefDict.outputData,
        value: undefined,
        ldType: LDDict.Blog
    }
];

const BP_CFG: BlueprintConfig = {
    subItptOf: null,
	nameSelf: NAME_SELF,
	ownKVLs: OWN_KVLS,
	inKeys: IN_KEYS,
	crudSkills: "cRud",
};

export default BP_CFG;
