import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";
import { UserDefDict } from "ldaccess/UserDefDict";

export var productRetrieverName = "shnyder/productRetriever";
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
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];

	srvUrl: string;
	identifier: string | number;
	constructor() {
		this.cfg = this.constructor["cfg"];
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		let kvs = ldOptions.resource.kvStores;
		let srvUrlKv: IKvStore = kvs.find((val) => cfgIntrprtKeys[1] === val.key);
		let identifier: IKvStore = kvs.find((val) => cfgIntrprtKeys[2] === val.key);
		let outputKVMap: IKvStore = kvs.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.outputKVMap = outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap;
		this.srvUrl = srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl;
		this.identifier = identifier && identifier.value != null ? identifier.value : this.identifier;
	}
}
