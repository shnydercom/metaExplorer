import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { UserDefDict } from "ldaccess/UserDefDict";

export var imageRetrieverName = "shnyder/imageRetriever";
let cfgIntrprtKeys: string[] =
	[UserDefDict.externalReferenceKey, SideFXDict.srvURL, SideFXDict.identifier];
let initialKVStores: IKvStore[] = [
	{
		key: UserDefDict.externalReferenceKey,
		value: undefined,
		ldType: LDDict.Text
	},
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
	subInterpreterOf: null,
	nameSelf: imageRetrieverName,
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ImageRetriever implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	constructor() {
		this.cfg = this.constructor["cfg"];
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		console.log("non-empty");
		return;
	};
}
