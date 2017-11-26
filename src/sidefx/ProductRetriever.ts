import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";

export var productRetrieverName = "shnyder/productRetriever";
let cfgType: string = productRetrieverName;
let cfgIntrprtKeys: string[] =
	[SideFXDict.srvURL, SideFXDict.identifier];
let initialKVStores: IKvStore[] = [
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
	forType: cfgType,
	nameSelf: productRetrieverName,
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	getInterpretableKeys() { return cfgIntrprtKeys; },
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ProductRetriever implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
}
