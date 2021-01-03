import { KVL } from '../../ldaccess/KVL';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap, OutputKVMapElement } from '../../ldaccess/ldBlueprint';

import { BaseContainerRewrite } from './baseContainer-rewrite';
import { LDLocalState, LDConnectedState, LDConnectedDispatch, LDOwnProps } from '../../appstate/LDProps';
import { Component } from 'react';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { gdsfpLD, initLDLocalState } from './generatorFns';
import { ldOptionsDeepCopy } from '../../ldaccess/ldUtils';
import { NetworkPreferredToken } from '../../ldaccess/ildtoken';
import { getKVStoreByKey } from '../../ldaccess/kvConvenienceFns';
import { UserDefDict } from '../../ldaccess/UserDefDict';
import React from 'react';

export const SingleDynamicTypeDisplayName = "metaexplorer.io/SingleDynamicTypeDisplay";
const inputdata = UserDefDict.inputData;
const singleDynamicTypeDisplayOutput = "mOut";
export const singleDynamicTypeDisplayCanInterpretType = "metaexplorer.io/SingleDynamicTypeDisplayType";

let SingleDynamicTypeDisplayInputKeys: string[] = [inputdata];
let ownKVLs: KVL[] = [
	{ key: inputdata, value: undefined, ldType: undefined }
];
export const SingleDynamicTypeDisplayCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SingleDynamicTypeDisplayName,
	ownKVLs: ownKVLs,
	inKeys: SingleDynamicTypeDisplayInputKeys,
	crudSkills: "cRud",
	canInterpretType: singleDynamicTypeDisplayCanInterpretType
};
export interface SingleDynamicTypeDisplayState extends LDLocalState {
	containertoken: string;
}

@ldBlueprint(SingleDynamicTypeDisplayCfg)
export class PureSingleDynamicTypeDisplay extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SingleDynamicTypeDisplayState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SingleDynamicTypeDisplayState): null | SingleDynamicTypeDisplayState {
		let rvLocal = gdsfpLD(nextProps, prevState, [], SingleDynamicTypeDisplayInputKeys, singleDynamicTypeDisplayCanInterpretType);
		if (!rvLocal) {
			return null;
		}
		let nextContainerTokenStr: string = nextProps.ldOptions.ldToken.get() + "-dynType";
		let nextContainerToken = new NetworkPreferredToken(nextContainerTokenStr);
		if (!prevState.containertoken) {
			const newLDOptionsFItpt: ILDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptionsFItpt.ldToken = nextContainerToken;
			const modKV: KVL = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, inputdata);
			if (modKV) {
				let newKvStores: KVL[] = [];
				let outputNum: number = 1;
				if (Array.isArray(modKV.value)) {
					let newLdType = modKV.ldType;
					outputNum = modKV.value.length;
					for (let i = 0; i < outputNum; i++) {
						newKvStores.push({
							key: singleDynamicTypeDisplayOutput + i,
							value: modKV.value[i],
							ldType: newLdType
						});
					}
				} else {
					newKvStores = [{ ...modKV }];
				}
				newLDOptionsFItpt.resource.kvStores = newKvStores;
				nextProps.notifyLDOptionsChange(newLDOptionsFItpt);
			}
		} else {
			const modKV: KVL | null = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, inputdata);
			if (modKV) {
				let outputKVMap: OutputKVMap = rvLocal.localValues.get(UserDefDict.outputKVMapKey);
				if (!outputKVMap) {
					outputKVMap = {};
				}
				let outputNum: number = 1;
				if (Array.isArray(modKV.value)) {
					outputNum = modKV.value.length;
					for (let i = 0; i < outputNum; i++) {
						const newElems: OutputKVMapElement[] = [{ targetLDToken: nextContainerToken, targetProperty: singleDynamicTypeDisplayOutput + i }];
						outputKVMap[inputdata] = newElems;
					}
				} else {
					const newElems: OutputKVMapElement[] = [{ targetLDToken: nextContainerToken, targetProperty: inputdata }];
					outputKVMap[inputdata] = newElems;
				}
				nextProps.dispatchKvOutput([modKV], nextContainerTokenStr, outputKVMap);
			}
		}
		let rvNew = { ...rvLocal };
		return { ...prevState, ...rvNew, containertoken: nextContainerTokenStr };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], SingleDynamicTypeDisplayInputKeys);
		this.state = { ...ldState, containertoken: null };
	}

	render() {
		const { containertoken } = this.state;
		if (!containertoken) return null;
		return <BaseContainerRewrite ldTokenString={this.state.containertoken} />;
	}
}
