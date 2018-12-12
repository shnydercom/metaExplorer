import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap, OutputKVMapElement } from 'ldaccess/ldBlueprint';

import { BaseContOwnProps, BaseContainerRewrite } from './baseContainer-rewrite';
import { LDLocalState, LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { Component } from 'react';
import { ILDOptions } from 'ldaccess/ildoptions';
import { getDerivedKVStateFromProps, initLDLocalState } from './generatorFns';
import { ldOptionsDeepCopy } from 'ldaccess/ldUtils';
import { NetworkPreferredToken } from 'ldaccess/ildtoken';
import { getKVStoreByKey } from 'ldaccess/kvConvenienceFns';
import { UserDefDict } from 'ldaccess/UserDefDict';

export const MagicBoxName = "shnyder/MagicBox";
const inputdata = "inputdata";
export const magicCanInterpretType = "shnyder/MagicBoxType";

let MagicBoxInputKeys: string[] = [inputdata];
let initialKVStores: IKvStore[] = [
	{ key: inputdata, value: undefined, ldType: undefined }
];
export const MagicBoxCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MagicBoxName,
	initialKvStores: initialKVStores,
	interpretableKeys: MagicBoxInputKeys,
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
		let rvLocal = getDerivedKVStateFromProps(nextProps, prevState, MagicBoxInputKeys);
		if (!rvLocal) {
			return null;
		}
		let nextContainerTokenStr: string = nextProps.ldOptions.ldToken.get() + "magic";
		let nextContainerToken = new NetworkPreferredToken(nextContainerTokenStr);
		if (!prevState.containertoken) {
			const newLDOptionsFItpt: ILDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptionsFItpt.ldToken = nextContainerToken;
			nextProps.notifyLDOptionsChange(newLDOptionsFItpt);
		} else {
			const modKV: IKvStore = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, inputdata);

			let outputKVMap: OutputKVMap = rvLocal.localValues.get(UserDefDict.outputKVMapKey);
			if (!outputKVMap) {
				outputKVMap = {};
			}
			const newElems: OutputKVMapElement[] = [{ targetLDToken: nextContainerToken, targetProperty: inputdata }];
			outputKVMap[inputdata] = newElems;
			nextProps.dispatchKvOutput([modKV], nextProps.ldTokenString, outputKVMap);
		}
		let rvNew = { ...rvLocal };
		return { ...prevState, ...rvNew, containertoken: nextContainerTokenStr };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

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

export const MagicList = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureMagicBox);
