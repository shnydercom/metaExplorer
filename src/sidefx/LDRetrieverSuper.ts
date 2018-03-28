import { IBlueprintItpt, BlueprintConfig, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { UserDefDict } from "ldaccess/UserDefDict";
import { SideFXDict } from "sidefx/SideFXDict";
import { ldOptionsRequestAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { expand } from 'urijs';
import { applicationStore } from "approot";
import { ILDToken } from 'ldaccess/ildtoken';
import { isOutputKVSame, ldOptionsDeepCopy, getKVValue } from "ldaccess/ldUtils";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";
import { ILDOptionsMapStatePart } from "appstate/store";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { nameSpaceMap } from "ldaccess/ns/nameSpaceMap";

export let ldRetrCfgIntrprtKeys: string[] =
	[UserDefDict.externalReferenceKey, SideFXDict.srvURL, SideFXDict.identifier];
export class LDRetrieverSuper implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	srvUrl: string;
	identifier: string | number;
	isInputDirty: boolean = false;
	isOutputDirty: boolean = false;
	retrieverStoreKey: string; //needed when requesting asynchronously, so that the output can find this
	webContent: IWebResource;
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
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		this.setSrvUrl(srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl);
		this.setIdentifier(identifier && identifier.value !== null ? identifier : this.identifier);
		this.setWebContent(ldOptions);
		this.evalDirtyInput();
		this.evalDirtyOutput();
	}
	setOutputKVMap = (value: OutputKVMap) => {
		if (!isOutputKVSame(value, this.outputKVMap)) this.isOutputDirty = true;
		this.outputKVMap = value;
	}
	setIdentifier = (value: IKvStore | string | number) => {
		if (getKVValue(value) !== this.identifier) this.isInputDirty = true;
		this.identifier = getKVValue(value);
	}
	setSrvUrl = (value: string) => {
		if (value !== this.srvUrl) this.isInputDirty = true;
		this.srvUrl = value;
	}
	setWebContent = (value: ILDOptions) => {
		if (value.isLoading) return;
		if (value.resource.webInResource && value.resource.webInResource !== this.webContent) {
			this.webContent = value.resource.webInResource;
			this.isOutputDirty = true;
		}
	}
	evalDirtyOutput = () => {
		if (this.isInputDirty) return;
		if (this.isOutputDirty && this.outputKVMap && this.webContent) {
			this.isOutputDirty = false;
			this.refreshOutput();
		}
	}
	evalDirtyInput = () => {
		if (this.isInputDirty) {
			if (this.srvUrl && this.srvUrl.length > 0 && this.identifier !== null && this.identifier !== undefined) {
				this.isInputDirty = false;
				let idStr = this.identifier.toString();
				let idSplitIdx = idStr.indexOf('/');
				let requestURL;
				if (idSplitIdx !== -1) {
					console.log(idStr.slice(0, idSplitIdx));
					let nsMHasValue = false;
					let nsMSearchVal = idStr.slice(0, idSplitIdx);
					for (const nsMEntry of
						nameSpaceMap.values()) {
						if (nsMEntry === nsMSearchVal) {
							nsMHasValue = true;
							break;
						}
					}
					if (nsMHasValue) {
						let idNS = idStr.slice(0, idSplitIdx);
						let idId = idStr.slice(idSplitIdx + 1, idStr.length);
						let reqSplitString = this.srvUrl.replace('{' + SideFXDict.identifier + '}',
							'{namespace}/' + '{' + SideFXDict.identifier + '}');
						requestURL = URI.expand(reqSplitString, {
							namespace: idNS,
							identifier: idId
						});
					} else {
						//TODO: enter error state
						return;
					}
				} else {
					requestURL = URI.expand(this.srvUrl, {
						identifier: this.identifier
					});
				}
				let reqAsString = requestURL.valueOf();
				applicationStore.dispatch(ldOptionsRequestAction(null, reqAsString, this.retrieverStoreKey));
			}
		}
	}
	private refreshOutput(): void {
		let okvmPNs = Object.getOwnPropertyNames(this.outputKVMap);
		let webObj = this.webContent;
		console.log(webObj);
		console.log(okvmPNs);
		console.log(this.outputKVMap);
		let statePart: ILDOptionsMapStatePart = {};
		okvmPNs.forEach((pn) => {
			let fillValue = webObj[pn];
			let targetTokenLnk = this.outputKVMap[pn].targetLDToken.get();
			let targetProp = this.outputKVMap[pn].targetProperty;
			let newLDOptions: ILDOptions;
			if (statePart[targetTokenLnk]) {
				newLDOptions = statePart[targetTokenLnk];
			} else {
				newLDOptions = applicationStore.getState().ldoptionsMap[targetTokenLnk];
				newLDOptions = ldOptionsDeepCopy(newLDOptions);
				statePart[targetTokenLnk] = newLDOptions;
			}
			let targetKVStore = getKVStoreByKey(newLDOptions.resource.kvStores, targetProp);
			if (targetKVStore) {
				targetKVStore.value = fillValue;
				targetKVStore.ldType = null;
			} else {
				targetKVStore = { key: targetProp, value: fillValue, ldType: null };
				newLDOptions.resource.kvStores.push(targetKVStore);
			}
		});
		for (const key in statePart) {
			if (statePart.hasOwnProperty(key)) {
				const element = statePart[key];
				applicationStore.dispatch(ldOptionsClientSideUpdateAction(element));
			}
		}
	}
}
