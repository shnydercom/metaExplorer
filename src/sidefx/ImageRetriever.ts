import { SideFXDict } from "sidefx/SideFXDict";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { ILDOptions } from "ldaccess/ildoptions";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDRetrieverSuper, ldRetrCfgIntrprtKeys } from "sidefx/LDRetrieverSuper";
import { getKVValue } from "ldaccess/ldUtils";
import { resolveNS } from "ldaccess/ns/nameSpaceResolution";

export const imageRetrieverName = "shnyder/imageRetriever";
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
	subItptOf: null,
	nameSelf: imageRetrieverName,
	initialKvStores: initialKVStores,
	interpretableKeys: ldRetrCfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class ImageRetriever extends LDRetrieverSuper {
	/*setIdentifier = (value: IKvStore) => {
		let kvResolved: string = getKVValue(value);
		let changedSrvIdPart = resolveNS(kvResolved);
		if (changedSrvIdPart !== this.identifier) this.isInputDirty = true;
		this.identifier = changedSrvIdPart;
	}*/
	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		super.consumeLDOptions(ldOptions);
		this.retrieverStoreKey = ldOptions.ldToken.get();
		let kvs = ldOptions.resource.kvStores;
		let identifier: IKvStore = kvs.find((val) => SideFXDict.identifier === val.key);
		let kvResolved: string = getKVValue(identifier);
		let changedSrvIdPart = resolveNS(kvResolved);
		let identifierKv = this.inputParams.get(SideFXDict.identifier);
		if (identifierKv && identifierKv.value && changedSrvIdPart !== identifierKv.value) this.isInputDirty = true;
		identifierKv.value = changedSrvIdPart;

		/*outputKVMap = outputKVMap ? outputKVMap : this.cfg.initialKvStores.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		for (let idx = 0; idx < ldRetrCfgIntrprtKeys.length; idx++) {
			const inputKey = ldRetrCfgIntrprtKeys[idx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param.value !== null) {
				this.inputParams.set(inputKey, param);
				this.isInputDirty = true;
			}
		}
		//this.setSrvUrl(srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl);
		//this.setIdentifier(identifier && identifier.value !== null ? identifier : this.identifier);
		this.setWebContent(ldOptions);
		this.evalDirtyInput();
		this.evalDirtyOutput();*/
	}
}
