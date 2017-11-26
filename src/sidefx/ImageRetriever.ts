import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";

export var imageRetrieverName = "shnyder/imageRetriever";
let cfgType: string = imageRetrieverName;
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
		key: LDDict.fileFormat,
		value: undefined,
		ldType: undefined
	},
	{
		key: LDDict.contentUrl,
		value: undefined,
		ldType: undefined
	}
];
let bpCfg: BlueprintConfig = {
	forType: cfgType,
	nameSelf: imageRetrieverName,
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	getInterpretableKeys() { return cfgIntrprtKeys; },
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ImageRetriever implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
}
