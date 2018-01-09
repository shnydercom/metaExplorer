import { IBlueprintInterpreter, BlueprintConfig, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { UserDefDict } from "ldaccess/UserDefDict";
import { SideFXDict } from "sidefx/SideFXDict";
import { ldOptionsRequestAction } from "appstate/epicducks/ldOptions-duck";
import { expand } from 'urijs';
import { applicationStore } from "approot";

export let ldRetrCfgIntrprtKeys: string[] =
	[UserDefDict.externalReferenceKey, SideFXDict.srvURL, SideFXDict.identifier];
export class LDRetrieverSuper implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	srvUrl: string;
	identifier: string | number;
	isDirty: boolean = false;
	retrieverStoreKey: string; //needed when requesting asynchronously, so that the output can find this
	constructor() {
		this.cfg = this.constructor["cfg"];
		this.retrieverStoreKey = this.cfg.nameSelf;
		if (this.cfg.initialKvStores) {
			let extRefKey = this.cfg.initialKvStores.find(
				(val) => val.key === UserDefDict.externalReferenceKey);
			this.retrieverStoreKey = extRefKey.value ? extRefKey.value : this.retrieverStoreKey;
		}
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		let kvs = ldOptions.resource.kvStores;
		let srvUrlKv: IKvStore = kvs.find((val) => ldRetrCfgIntrprtKeys[1] === val.key);
		srvUrlKv = srvUrlKv ? srvUrlKv : this.cfg.initialKvStores.find((val) => ldRetrCfgIntrprtKeys[1] === val.key);
		let identifier: IKvStore = kvs.find((val) => ldRetrCfgIntrprtKeys[2] === val.key);
		let outputKVMap: IKvStore = kvs.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.outputKVMap = outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap;
		this.setSrvUrl(srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl);
		this.setIdentifier(identifier && identifier.value != null ? identifier.value : this.identifier);
		this.evalDirty();
	}
	setIdentifier = (value: string | number) => {
		if (value !== this.identifier) this.isDirty = true;
		this.identifier = value;
	}
	setSrvUrl = (value: string) => {
		if (value !== this.srvUrl) this.isDirty = true;
		this.srvUrl = value;
	}
	evalDirty = () => {
		if (this.isDirty) {
			if (this.srvUrl && this.srvUrl.length > 0 && this.identifier !== null && this.identifier !== undefined) {
				this.isDirty = false;
				let requestURL = URI.expand(this.srvUrl, {
					identifier: this.identifier
				});
				let reqAsString = requestURL.valueOf();
				applicationStore.dispatch(ldOptionsRequestAction(null, reqAsString, this.retrieverStoreKey));
			}
		}
	}
}
