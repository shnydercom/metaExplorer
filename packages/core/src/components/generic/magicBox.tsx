import { IKvStore } from '../../ldaccess/ikvstore';
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

export const MagicBoxName = "metaexplorer.io/MagicBox";
const inputdata = UserDefDict.inputData;
const magicOutput = "mOut";
export const magicCanInterpretType = "metaexplorer.io/MagicBoxType";

let MagicBoxInputKeys: string[] = [inputdata];
let ownKVL: IKvStore[] = [
	{ key: inputdata, value: undefined, ldType: undefined }
];
export const MagicBoxCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MagicBoxName,
	ownKVL: ownKVL,
	inKeys: MagicBoxInputKeys,
	crudSkills: "cRud",
	canInterpretType: magicCanInterpretType
};
export interface MagicBoxState extends LDLocalState {
	containertoken: string;
}

@ldBlueprint(MagicBoxCfg)
export class PureMagicBox extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, MagicBoxState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: MagicBoxState): null | MagicBoxState {
		let rvLocal = gdsfpLD(nextProps, prevState, [], MagicBoxInputKeys, magicCanInterpretType);
		if (!rvLocal) {
			return null;
		}
		let nextContainerTokenStr: string = nextProps.ldOptions.ldToken.get() + "magic";
		let nextContainerToken = new NetworkPreferredToken(nextContainerTokenStr);
		if (!prevState.containertoken) {
			const newLDOptionsFItpt: ILDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptionsFItpt.ldToken = nextContainerToken;
			const modKV: IKvStore = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, inputdata);
			let outputNum: number = 1;
			if (Array.isArray(modKV.value)) {
				let newLdType = modKV.ldType;
				let newKvStores: IKvStore[] = [];
				outputNum = modKV.value.length;
				for (let i = 0; i < outputNum; i++) {
					newKvStores.push({
						key: magicOutput + i,
						value: modKV.value[i],
						ldType: newLdType
					});
				}
				newLDOptionsFItpt.resource.kvStores = newKvStores;
			}
			nextProps.notifyLDOptionsChange(newLDOptionsFItpt);
		} else {
			const modKV: IKvStore = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, inputdata);

			let outputKVMap: OutputKVMap = rvLocal.localValues.get(UserDefDict.outputKVMapKey);
			if (!outputKVMap) {
				outputKVMap = {};
			}
			let outputNum: number = 1;
			if (Array.isArray(modKV.value)) {
				outputNum = modKV.value.length;
				for (let i = 0; i < outputNum; i++) {
					const newElems: OutputKVMapElement[] = [{ targetLDToken: nextContainerToken, targetProperty: magicOutput + i }];
					outputKVMap[inputdata] = newElems;
				}
			} else {
				const newElems: OutputKVMapElement[] = [{ targetLDToken: nextContainerToken, targetProperty: inputdata }];
				outputKVMap[inputdata] = newElems;
			}
			nextProps.dispatchKvOutput([modKV], nextProps.ldTokenString, outputKVMap);
		}
		let rvNew = { ...rvLocal };
		return { ...prevState, ...rvNew, containertoken: nextContainerTokenStr };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVL: IKvStore[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], MagicBoxInputKeys);
		this.state = { ...ldState, containertoken: null };
	}

	render() {
		const { containertoken } = this.state;
		if (!containertoken) return null;
		return <BaseContainerRewrite ldTokenString={this.state.containertoken} />;
	}
}
