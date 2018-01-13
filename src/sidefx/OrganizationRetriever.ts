import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDRetrieverSuper, ldRetrCfgIntrprtKeys } from "sidefx/LDRetrieverSuper";

export const organizationRetrieverName = "shnyder/organizationRetriever";

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
	subInterpreterOf: null,
	nameSelf: organizationRetrieverName,
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: ldRetrCfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class OrganizationRetriever extends LDRetrieverSuper { }
