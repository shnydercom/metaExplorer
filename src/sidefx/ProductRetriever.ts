import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";

export var productRetrieverName = "shnyder/productRetriever";
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
	subInterpreterOf: null,
	nameSelf: productRetrieverName,
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ProductRetriever implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
}
