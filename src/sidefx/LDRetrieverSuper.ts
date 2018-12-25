import { IBlueprintItpt, BlueprintConfig, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { UserDefDict } from "ldaccess/UserDefDict";
import { SideFXDict } from "sidefx/SideFXDict";
import { ldOptionsRequestAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { applicationStore } from "approot";
import { ILDToken } from 'ldaccess/ildtoken';
import { isOutputKVSame, ldOptionsDeepCopy, getKVValue, isObjPropertyRef } from "ldaccess/ldUtils";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";
import { ILDOptionsMapStatePart } from "appstate/store";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { nameSpaceMap } from "ldaccess/ns/nameSpaceMap";
// import URI from 'urijs';

export let ldRetrCfgIntrprtKeys: string[] =
	[SideFXDict.srvURL, SideFXDict.identifier];
export class LDRetrieverSuper implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	inputParams: Map<string, IKvStore>;
	//srvUrl: string;
	//identifier: string | number;
	isInputDirty: boolean = false;
	isOutputDirty: boolean = false;
	retrieverStoreKey: string; //needed when requesting asynchronously, so that the output can find this
	webContent: IWebResource;

	protected apiCallOverride: (() => Promise<any>) | null = null;

	constructor() {
		this.cfg = this.constructor["cfg"];
		this.inputParams = new Map();
		//this.retrieverStoreKey = this.cfg.nameSelf;
		/*if (this.cfg.initialKvStores) {
			let extRefKey = this.cfg.initialKvStores.find(
				(val) => val.key === UserDefDict.externalReferenceKey);
			this.retrieverStoreKey = extRefKey.value ? extRefKey.value : this.retrieverStoreKey;
		}*/
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		this.retrieverStoreKey = ldOptions.ldToken.get();
		let kvs = ldOptions.resource.kvStores;
		let outputKVMap: IKvStore = kvs.find((val) => UserDefDict.outputKVMapKey === val.key);
		outputKVMap = outputKVMap ? outputKVMap : this.cfg.initialKvStores.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		for (let idx = 0; idx < ldRetrCfgIntrprtKeys.length; idx++) {
			const inputKey = ldRetrCfgIntrprtKeys[idx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param && param.value !== null) {
				this.inputParams.set(inputKey, param);
				this.isInputDirty = true;
			}
		}
		//this.setSrvUrl(srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl);
		//this.setIdentifier(identifier && identifier.value !== null ? identifier : this.identifier);
		this.setWebContent(ldOptions);
		this.evalDirtyInput();
		this.evalDirtyOutput();
	}
	setOutputKVMap = (value: OutputKVMap) => {
		if (!isOutputKVSame(value, this.outputKVMap)) this.isOutputDirty = true;
		this.outputKVMap = value;
	}
	/*setIdentifier = (value: IKvStore | string | number) => {
		if (getKVValue(value) !== this.identifier) this.isInputDirty = true;
		this.identifier = getKVValue(value);
	}
	setSrvUrl = (value: string) => {
		if (value !== this.srvUrl) this.isInputDirty = true;
		this.srvUrl = value;
	}*/
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
			if (!this.apiCallOverride) {
				//if it's an jsonld-request
				let srvUrl = this.inputParams.get(ldRetrCfgIntrprtKeys[0]);
				let identifier = this.inputParams.get(ldRetrCfgIntrprtKeys[1]);
				if (srvUrl && srvUrl.value && srvUrl.value.length > 0
					&& identifier
					&& identifier.value !== null && identifier.value !== undefined) {
					this.isInputDirty = false;
					let idStr = identifier.toString();
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
							/*let reqSplitString = srvUrl.value.replace('{' + SideFXDict.identifier + '}',
								'{namespace}/' + '{' + SideFXDict.identifier + '}');
							requestURL = URI.expand(reqSplitString, {
								namespace: idNS,
								identifier: idId
							});
							requestURL = srvUrl.value;*/
							requestURL = requestURL.replace('{' + SideFXDict.identifier + '}', idNS + '/' + idId);
						} else {
							//TODO: enter error state
							return;
						}
					} else {
						const idVal = identifier.value;
						if (!idVal || isObjPropertyRef(idVal)) {
							return;
						}
						requestURL = srvUrl.value + idVal;
						/*let test = URI;
						requestURL = test.expand(srvUrl.value, {
							identifier: identifier.value
						});*/
					}
					let reqAsString = requestURL; // requestURL.valueOf();
					this.callToAPI(null, reqAsString, this.retrieverStoreKey);
				}
			} else {
				this.isInputDirty = false;
				this.callToAPI(null, null, this.retrieverStoreKey);
			}
		}
	}

	protected callToAPI(uploadData?: ILDOptions, targetUrl?: string, targetReceiverLnk?): void {
		applicationStore.dispatch(ldOptionsRequestAction(this.apiCallOverride, uploadData, targetUrl, targetReceiverLnk));
	}

	private refreshOutput(): void {
		let okvmPNs = Object.getOwnPropertyNames(this.outputKVMap);
		let webObj = this.webContent;
		console.log("ldRetrieverSuper got new output");
		console.log(webObj);
		console.log(okvmPNs);
		console.log(this.outputKVMap);
		let statePart: ILDOptionsMapStatePart = {};
		okvmPNs.forEach((pn) => {
			let fillValue = webObj[pn];
			let outputElems = this.outputKVMap[pn];
			for (let i = 0; i < outputElems.length; i++) {
				const outputElem = outputElems[i];
				let targetTokenLnk = outputElem.targetLDToken.get();
				let targetProp = outputElem.targetProperty;
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
