import { SideFXDict } from "./../sidefx/SideFXDict";
import { LDDict } from "./../ldaccess/LDDict";
import { KVL } from "./../ldaccess/KVL";
import { ldBlueprint, BlueprintConfig } from "./../ldaccess/ldBlueprint";
import { LDRetrieverSuper } from "./../sidefx/LDRetrieverSuper";
import { ldRetrCfgIntrprtKeys } from "./LDRetrieverSuper-rewrite";

export const organizationRetrieverName = "metaexplorer.io/organizationRetriever";

let ownKVLs: KVL[] = [
	{
		key: SideFXDict.srvURL,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: SideFXDict.identifier,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: LDDict.name,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: LDDict.address,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: LDDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: LDDict.image,
		value: undefined,
		ldType: undefined
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: organizationRetrieverName,
	ownKVLs: ownKVLs,
	inKeys: ldRetrCfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class OrganizationRetriever extends LDRetrieverSuper { }
