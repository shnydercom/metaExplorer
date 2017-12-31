import ldBlueprint, { BlueprintConfig, OutputKVMap, OutputKVMapElement } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { IKvStore } from "ldaccess/ikvstore";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { ILDToken, NetworkPreferredToken } from "ldaccess/ildtoken";
import { LDDict } from "ldaccess/LDDict";
import appIntRetrFn from 'appconfig/appInterpreterRetriever';
import { IInterpreterRetriever } from "ldaccess/iinterpreter-retriever";
import { mapDispatchToProps, mapStateToProps } from "appstate/reduxFns";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from "appstate/LDProps";
import { connect } from "react-redux";
import { ReduxInterpreterRetriever } from "ld-react-redux-connect/ReduxInterpreterRetriever";
import * as React from "react";
import { isReactComponent } from "components/reactUtils/reactUtilFns";
import { ILDOptions } from "ldaccess/ildoptions";
import { ILDResource } from "ldaccess/ildresource";

type InterpretableKeysInfo = {
	ref: ObjectPropertyRef,
	kvStore: IKvStore
};
// & { ldTokenSubString: string };
export type OutputLDOptionsTupel = { key: string, objPropRef: ObjectPropertyRef };
export type OutputLDOptionsPrepMap = {
	[s: string]: {
		refs: OutputLDOptionsTupel[]
	}
};
export type InterpreterMap = { [s: string]: any };

export type LDOptionsMap = { [s: string]: ILDOptions };

export var REFMAP_HEAD = "head";

export class RefMapTypeDesintegrator {
	ldOptionsPrepMap: OutputLDOptionsPrepMap;
	headInterpreterLnk: string;
	interpreterMap: InterpreterMap;
	retriever: ReduxInterpreterRetriever = appIntRetrFn() as ReduxInterpreterRetriever;
	public setRefMapBP = (input: BlueprintConfig) => {
		let refMapCandidate: any = null;
		let refMapContentCandidate: string = null;
		this.interpreterMap = {};
		this.headInterpreterLnk = input.subInterpreterOf;
		input.initialKvStores.forEach((val, idx) => {
			if (val.ldType === UserDefDict.intrprtrBPCfgRefMapType) {
				if (typeof val.value === "string") {
					refMapCandidate = JSON.parse(val.value);
				} else {
					refMapCandidate = val.value;
				}
			}
		});
		if (!refMapCandidate) return;
		let headInterpreter: BlueprintConfig = refMapCandidate[this.headInterpreterLnk];
		let interpretableKeysInfos: InterpretableKeysInfo[] = [];
		input.interpretableKeys.forEach((elem: ObjectPropertyRef) => {
			let newElem: InterpretableKeysInfo = {
				ref: elem,
				kvStore: refMapCandidate[elem.objRef]
			};
			interpretableKeysInfos.push(newElem);
		});
		this.ldOptionsPrepMap = {};
		for (let cfgKey in refMapCandidate) {
			if (refMapCandidate.hasOwnProperty(cfgKey)) {
				let cfgVal: BlueprintConfig = refMapCandidate[cfgKey];
				//construct actual interpreter-classes
				this.interpreterMap[cfgKey] = this.assignSubBPCfgToInterpreter(cfgVal, cfgKey);
			}
		}
		//diese keys werden dafür verwendet, den input type bei Änderungen weiter zu geben.
		//jede ObjectPropertyRef bekommt einen ldTokenString, über den kommunizieren die Komponenten
		console.log("logging refMapCandidate");
		console.log(refMapCandidate);
	}

	public createConcatNetworkPreferredToken(inputLDTokenString: string, targetIntrprtrLnk: string): NetworkPreferredToken {
		return new NetworkPreferredToken(inputLDTokenString + "_" + targetIntrprtrLnk);
	}

	public fillSubOutputKVmaps(inputLDTokenString: string): { [s: string]: OutputKVMap } {
		let subOutputKVmaps: { [s: string]: OutputKVMap } = {};
		for (let pmKey in this.ldOptionsPrepMap) {
			if (this.ldOptionsPrepMap.hasOwnProperty(pmKey)) {
				let targetIntrprtrLnk: string = pmKey;
				let pmVal = this.ldOptionsPrepMap[pmKey];
				pmVal.refs.forEach((tupel: OutputLDOptionsTupel) => {
					//setting the link on the source Map (outputKvMaps):
					let targetPropLnk: string = tupel.key;
					let sourceIntrprtLnk = tupel.objPropRef.objRef;
					let sourceProperty = tupel.objPropRef.propRef;
					let targetLDToken: ILDToken = this.createConcatNetworkPreferredToken(inputLDTokenString, targetIntrprtrLnk);
					let sourcLDToken: ILDToken = this.createConcatNetworkPreferredToken(inputLDTokenString, sourceIntrprtLnk);
					let newOKVMObj: OutputKVMapElement = {
						targetLDToken: targetLDToken,
						targetProperty: targetPropLnk
					};
					if (!sourceProperty) sourceProperty = UserDefDict.exportSelfKey;
					let subSlice = subOutputKVmaps[sourceIntrprtLnk];
					if (!subSlice) subSlice = {};
					subSlice = { ...subSlice, [sourceProperty]: newOKVMObj };
					subOutputKVmaps[sourceIntrprtLnk] = subSlice;
					//setting the link and interpreter on the target (initialKvStores):
					let targetIntrprtrCfg: BlueprintConfig = this.interpreterMap[targetIntrprtrLnk].cfg;
					let targetKey = targetPropLnk;
					let targetValue = sourcLDToken.get();
					let targetLDType = this.determineType(sourceProperty);
					let targetIntrprtrClass = sourceProperty === UserDefDict.exportSelfKey ? this.interpreterMap[sourceIntrprtLnk] : null;
					let newTargetKV: IKvStore = {
						key: targetKey,
						value: targetValue,
						ldType: targetLDType,
						intrprtrClass: targetIntrprtrClass
					};
					targetIntrprtrCfg.initialKvStores.push(newTargetKV);
					console.log(targetIntrprtrCfg);
				});
			}
		}
		console.log(subOutputKVmaps);
		return subOutputKVmaps;
	}

	public fillLDOptions(input: { [s: string]: OutputKVMap }, ldTokenString: string): LDOptionsMap {
		let rv: LDOptionsMap = {};
		for (let okvmKey in input) {
			if (input.hasOwnProperty(okvmKey)) {
				let okvm = input[okvmKey];
				//create link on target
				for (let propKey in okvm) {
					if (okvm.hasOwnProperty(propKey)) {
						let prop = okvm[propKey];
						let ldSubTokenString = prop.targetLDToken.get();
						let reverseToken = this.createConcatNetworkPreferredToken(ldTokenString, okvmKey);
						if (!rv[ldSubTokenString]) {
							let lang: string;
							let resource: ILDResource = {
								kvStores: [{ key: prop.targetProperty, ldType: UserDefDict.ldTokenStringReference, value: reverseToken.get() }],
								webInResource: null,
								webOutResource: null
							};
							let ldToken: ILDToken = new NetworkPreferredToken(ldSubTokenString);
							let isLoading: boolean = false;
							let newLDOptions: ILDOptions = {
								lang, resource, ldToken, isLoading
							};
							rv[ldSubTokenString] = newLDOptions;
						} else {
							let modLDOptions = rv[ldSubTokenString];
							modLDOptions.resource.kvStores.push({ key: prop.targetProperty, ldType: UserDefDict.ldTokenStringReference, value: reverseToken.get() });
						}
					}
				}
				//create link on source
				let compLDToken = this.createConcatNetworkPreferredToken(ldTokenString, okvmKey);
				let sourceresource: ILDResource = {
					kvStores: [{ key: UserDefDict.outputKVMapKey, ldType: UserDefDict.outputKVMapType, value: okvm }],
					webInResource: null,
					webOutResource: null
				};
				let newSourceLDOptions: ILDOptions = {
					lang: undefined, resource: sourceresource, ldToken: compLDToken, isLoading: false
				};
				rv[compLDToken.get()] = newSourceLDOptions;
			}
		}
		return rv;
	}

	public fillOutputKVMaps(ldTokenString: string, soKVM: { [s: string]: OutputKVMap }): LDOptionsMap {
		let rv: LDOptionsMap = {};
		for (let intrprtrKey in this.interpreterMap) {
			if (this.interpreterMap.hasOwnProperty(intrprtrKey)) {
				if (intrprtrKey === this.headInterpreterLnk) continue;
				let GenericComp = this.interpreterMap[intrprtrKey];
				if (!isReactComponent(GenericComp)) continue;
				let kvMap = soKVM[intrprtrKey];
				let compLDToken = this.createConcatNetworkPreferredToken(ldTokenString, intrprtrKey);
				let lang: string;
				let resource: ILDResource = {
					kvStores: [{ key: null, ldType: null, value: null }],
					webInResource: null,
					webOutResource: null
				};
			}
		}
		return rv;
	}

	private assignSubBPCfgToInterpreter(bpCfg: BlueprintConfig, bpKey: string): any {
		let rv: any;
		let rvCfg: BlueprintConfig;
		let baseInterpreter = this.retriever.getUnconnectedByNameSelf(bpCfg.subInterpreterOf);
		let fixedInitialKVStores: IKvStore[] = [];
		bpCfg.initialKvStores.forEach((elemKV) => {
			if (isObjPropertyRef(elemKV.value)) {
				//build ldOptionsPrepMap for RefMap (doesn't affect rv)
				if (!this.ldOptionsPrepMap[bpKey]) this.ldOptionsPrepMap[bpKey] = { refs: new Array<OutputLDOptionsTupel>() };
				this.ldOptionsPrepMap[bpKey].refs.push({ key: elemKV.key, objPropRef: elemKV.value });
			} else {
				//assign fixed value to Interpreter
				fixedInitialKVStores.push(elemKV);
			}
		});
		rvCfg = {
			subInterpreterOf: bpCfg.subInterpreterOf,
			nameSelf: bpCfg.nameSelf,
			canInterpretType: bpCfg.canInterpretType,
			crudSkills: bpCfg.crudSkills,
			initialKvStores: fixedInitialKVStores,
			interpretableKeys: []
		};
		baseInterpreter = ldBlueprint(rvCfg)(baseInterpreter);
		if (isReactComponent(baseInterpreter)) {
			rv = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(baseInterpreter);
		} else {
			rv = baseInterpreter;
		}
		return rv;
	}

	private determineType(sourceType: string): string {
		let rv: string = null;
		switch (sourceType) {
			case UserDefDict.exportSelfKey:
				rv = UserDefDict.intrprtrObjectType;
				break;
			default:
				rv = UserDefDict.ldTokenStringReference;
				break;
		}
		return rv;
	}
}
