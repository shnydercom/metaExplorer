import { SideFXDict } from "./SideFXDict";
import { LDDict } from "./../ldaccess/LDDict";
import { IKvStore } from "./../ldaccess/ikvstore";
import { ldBlueprint, BlueprintConfig } from "./../ldaccess/ldBlueprint";
import { LDRetrieverSuperRewrite, ldRetrCfgIntrprtKeys } from "./LDRetrieverSuper-rewrite";

export const productRetrieverName = "metaexplorer.io/productRetriever";

let ownKVL: IKvStore[] = [
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
		key: LDDict.manufacturer,
		value: undefined,
		ldType: LDDict.Organization
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
	nameSelf: productRetrieverName,
	ownKVL: ownKVL,
	inKeys: ldRetrCfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ProductRetriever extends LDRetrieverSuperRewrite { }
