import { IKvStore } from 'ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { LDDict } from 'ldaccess/LDDict';
import { SideFXDict } from './SideFXDict';
import { gdsfpLD, initLDLocalState } from 'components/generic/generatorFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { applicationStore } from 'approot';
import { ldOptionsClientSideUpdateAction, ldOptionsRequestAction } from 'appstate/epicducks/ldOptions-duck';
import { ldOptionsDeepCopy, isObjPropertyRef } from 'ldaccess/ldUtils';
import { getKVStoreByKey } from 'ldaccess/kvConvenienceFns';
import { ILDOptionsMapStatePart } from 'appstate/store';

import { nameSpaceMap } from "ldaccess/ns/nameSpaceMap";
import { UserDefDict } from 'ldaccess/UserDefDict';

export const ldRetrCfgIntrprtKeys: string[] = [SideFXDict.srvURL, SideFXDict.identifier];
let ldRetrInitialKVStores: IKvStore[] = [
	{ key: SideFXDict.srvURL, value: undefined, ldType: LDDict.Text },
	{ key: SideFXDict.identifier, value: undefined, ldType: LDDict.Text }
];

export interface LDRetrieverSuperState extends LDLocalState {
	isInputDirty: boolean;
	isOutputDirty: boolean;
	webContent: IWebResource;
	retrieverStoreKey: string;
	interpretableKeys: string[];
}

export abstract class LDRetrieverSuperRewrite implements IBlueprintItpt {
	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	inputKeys: string[];
	protected state: LDRetrieverSuperState;
	//non-interface declarations
	protected apiCallOverride: (() => Promise<any>) | null = null;

	constructor(ldTkStr?: string, inputKeys?: string[]) {
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		inputKeys = inputKeys ? inputKeys : ldRetrCfgIntrprtKeys;
		this.inputKeys = inputKeys;
		const ldState = initLDLocalState(this.cfg, null, [], [...inputKeys, UserDefDict.outputKVMapKey]);
		let okvMap = ldState.localValues.get(UserDefDict.outputKVMapKey);
		if (okvMap) {
			this.outputKVMap = okvMap;
		}
		this.state = {
			isInputDirty: false,
			isOutputDirty: false,
			webContent: null,
			retrieverStoreKey: ldTkStr,
			interpretableKeys: this.inputKeys,
			...ldState
		};
	}

	setState(input: LDRetrieverSuperState) {
		this.state = input;
	}

	consumeLDOptions(ldOptions: ILDOptions) {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		const gdsfpResult = this.consumeLDOptionsLikeGDSFP(ldOptions);
		if (gdsfpResult) {
			for (let idx = 0; idx < this.inputKeys.length; idx++) {
				const inputKey = this.inputKeys[idx];
				let param = gdsfpResult.localValues.get(inputKey);
				if (!param) break;
				let prevParam = this.state.localValues.get(inputKey);
				if (param !== prevParam) {
					gdsfpResult.isInputDirty = true;
					break;
				}
			}
			let okvMap = gdsfpResult.localValues.get(UserDefDict.outputKVMapKey);
			if (okvMap) {
				this.outputKVMap = okvMap;
			}
			this.setState(gdsfpResult);
			this.setWebContent(ldOptions);
			this.evalDirtyInput();
			this.evalDirtyOutput();
		}
	}

	setWebContent(value: ILDOptions) {
		if (value.isLoading) return;
		if (value.resource.webInResource && (value.resource.webInResource !== this.state.webContent)) {
			const changedState = {
				...this.state,
				webContent: value.resource.webInResource,
				isOutputDirty: true
			};
			this.setState(changedState);
		}
	}

	evalDirtyOutput() {
		if (this.state.isInputDirty) return;
		if (this.state.isOutputDirty && this.outputKVMap && this.state.webContent) {
			this.setState({ ...this.state, isOutputDirty: false });
			this.refreshOutput();
		}
	}

	evalDirtyInput() {
		if (this.state.isInputDirty) {
			if (!this.apiCallOverride) {
				const { localValues } = this.state;
				//if it's an jsonld-request
				let srvUrl: string = localValues.get(this.inputKeys[0]);
				let identifier: string = localValues.get(this.inputKeys[1]);
				if (srvUrl && srvUrl.length > 0
					&& identifier !== null && identifier !== undefined) {
					this.setState({ ...this.state, isInputDirty: false });
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
							requestURL = srvUrl;
							requestURL = requestURL.replace('{' + SideFXDict.identifier + '}', idNS + '/' + idId);
						} else {
							//TODO: enter error state
							return;
						}
					} else {
						const idVal = identifier;
						if (!idVal || isObjPropertyRef(idVal)) {
							return;
						}
						requestURL = srvUrl + idVal;
						/*let test = URI;
						requestURL = test.expand(srvUrl.value, {
							identifier: identifier.value
						});*/
					}
					this.setState({ ...this.state, isInputDirty: false });
					let reqAsString = requestURL; // requestURL.valueOf();
					this.callToAPI(null, reqAsString, this.state.retrieverStoreKey);
				}
			} else {
				this.setState({ ...this.state, isInputDirty: false });
				this.callToAPI(null, null, this.state.retrieverStoreKey);
			}
		}
	}

	protected callToAPI(uploadData?: ILDOptions, targetUrl?: string, targetReceiverLnk?): void {
		applicationStore.dispatch(ldOptionsRequestAction(this.apiCallOverride, uploadData, targetUrl, targetReceiverLnk));
	}

	protected refreshOutput(): void {
		let okvmPNs = Object.getOwnPropertyNames(this.outputKVMap);
		let webObj = this.state.webContent;
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

	protected consumeLDOptionsLikeGDSFP(ldOptions: ILDOptions): LDRetrieverSuperState | null {
		const ldTkStr: string = ldOptions.ldToken.get();
		let nextProps: LDConnectedState & LDOwnProps = {
			ldOptions,
			ldTokenString: ldTkStr
		};
		let prevState: LDRetrieverSuperState = this.state;

		let rvLD = gdsfpLD(nextProps, prevState,
			[],
			[...this.inputKeys, UserDefDict.outputKVMapKey],
			null
		);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...this.state, ...rvLD, retrieverStoreKey: ldTkStr };
		return { ...rvNew };
	}

}
