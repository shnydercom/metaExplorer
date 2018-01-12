import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from "ldaccess/ldBlueprint";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ILDOptions } from "ldaccess/ildoptions";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDRetrieverSuper, ldRetrCfgIntrprtKeys } from "sidefx/LDRetrieverSuper";
import { getKVValue } from "ldaccess/ldUtils";
import { resolveNS } from "ldaccess/ns/nameSpaceResolution";

export var imageRetrieverName = "shnyder/imageRetriever";
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
	interpretableKeys: ldRetrCfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ImageRetriever extends LDRetrieverSuper {
	setIdentifier = (value: IKvStore) => {
		let kvResolved: string = getKVValue(value);
		let changedSrvIdPart = resolveNS(kvResolved);
		if (changedSrvIdPart !== this.identifier) this.isInputDirty = true;
		this.identifier = changedSrvIdPart;
	}
}
