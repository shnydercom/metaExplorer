import React from 'react';
import { BlueprintConfig } from '../../../ldaccess/ldBlueprint';
import { IBlueprintItpt } from '../../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../../ldaccess/ildoptions';

import { IKvStore } from '../../../ldaccess/ikvstore';
import { LDDict } from '../../../ldaccess/LDDict';

import { LDBaseDataType } from '../../../ldaccess/LDBaseDataType';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDLocalState } from "../../../appstate/LDProps";
import { ldOptionsDeepCopy } from "../../../ldaccess/ldUtils";
import { Component, ReactNode } from "react";
import { UserDefDict } from "../../../ldaccess/UserDefDict";
import { getKVStoreByKey } from "../../../ldaccess/kvConvenienceFns";
import { gdsfpLD, initLDLocalState, determineSingleKVKey } from "../../generic/generatorFns";

/**
 * @author Jonathan Schneider
 * for each Base Data Type an itpt is being configured, the React-Part
 * of the itpt is the same for all Base Data Types
 */

type OwnProps = {
	//singleKV: IKvStore; //TODO: doesn't seem to be used any more as react-prop
} & LDOwnProps;

type BaseDataTypeState = {
	singleKVOutput: IKvStore,
	singleKVInputKey: string,
	singleKVOutputKey: string
};

export interface PureBaseDataTypeInputComponent {
	renderSingleKv(baseDT: LDBaseDataType): ReactNode;
}

let bdts: LDBaseDataType[] = [LDDict.Boolean, LDDict.Integer, LDDict.Double, LDDict.Text, LDDict.Date, LDDict.DateTime];
export const baseDataTypeBpcfgs: BlueprintConfig[] = new Array();

for (var bdt in bdts) {
	if (bdts.hasOwnProperty(bdt)) {
		var elem = bdts[bdt];
		//let cfgType: string = LDDict.CreateAction;
		let cfgIntrprtKeys: string[] = [LDDict.description, UserDefDict.inputData];
		let initialKVStores: IKvStore[] = [
			{
				key: LDDict.description,
				value: undefined,
				ldType: LDDict.Text
			},
			{//if inputdata is not used explicitly, BaseDataTypeInput tries to determine the key dynamically
				key: UserDefDict.inputData,
				value: undefined,
				ldType: elem
			},
			{//one for output, gets ignored
				key: UserDefDict.outputData,
				value: undefined,
				ldType: elem
			},
		];
		let bpCfg: BlueprintConfig = {
			subItptOf: undefined,
			canInterpretType: elem,
			nameSelf: "shnyder/material-design/" + elem,
			initialKvStores: initialKVStores,
			interpretableKeys: cfgIntrprtKeys,
			crudSkills: "CRUd"
		};
		baseDataTypeBpcfgs.push(bpCfg);
	}
}
export abstract class AbstractBaseDataTypeInput extends Component<LDConnectedState & LDConnectedDispatch & OwnProps, BaseDataTypeState & LDLocalState>
	implements IBlueprintItpt, PureBaseDataTypeInputComponent {

	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];

	constructor(props?: LDConnectedState & LDConnectedDispatch & OwnProps) {
		super(props);
		this.cfg = this.constructor["cfg"];
		let bdtState: BaseDataTypeState = {
			singleKVOutput: null,
			singleKVInputKey: UserDefDict.inputData,
			singleKVOutputKey: UserDefDict.outputData
		};
		this.state = {
			...bdtState,
			...initLDLocalState(
				this.cfg, props,
				[],
				[LDDict.description, UserDefDict.inputData, UserDefDict.outputKVMapKey])
		};
		this.state = {
			...this.state, singleKVOutput:
			{
				key: this.state.singleKVOutputKey,
				value: this.state.localValues.get(this.state.singleKVInputKey),
				ldType: this.state.localLDTypes.get(this.state.singleKVInputKey)
			}
		};
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	handleChange = (evtval) => {
		let singleInputKey: string = this.state.singleKVInputKey;
		let modSingleKV: IKvStore = {
			key: this.state.singleKVOutputKey,
			ldType: this.state.localLDTypes.get(singleInputKey),
			value: this.state.localValues.get(singleInputKey)
		};
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKVOutput: modSingleKV });
		//TODO: it might be a good idea to debounce before updating the application state
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap || !outputKVMap[this.state.singleKVOutputKey]) return;
		this.props.dispatchKvOutput([modSingleKV], this.props.ldTokenString, outputKVMap);
	}

	componentDidMount() {
		if (!this.state.singleKVOutput || !this.state.singleKVOutput.ldType) {
			console.log('PureBaseDataTypeInput notifyLDOptionsChange');
			//this self-creates an object. Used e.g. in the itpt-editor, bdt-part
			console.dir(this.props.ldOptions);
			if (this.props.ldOptions) {
				let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
				let kvStoreIdx = newLDOptionsObj.resource.kvStores.findIndex((a) => {
					return UserDefDict.singleKvStore.toString() === a.key;
				});
				let singleKv: IKvStore;
				if (kvStoreIdx === -1) {
					singleKv = { key: UserDefDict.singleKvStore, value: null, ldType: this.cfg.canInterpretType };
					newLDOptionsObj.resource.kvStores.push(singleKv);
					this.props.notifyLDOptionsChange(newLDOptionsObj);
				}
			} else {
				this.props.notifyLDOptionsChange(null);
			}
		}
	}
	render() {
		return <>{this.renderSingleKv(this.cfg.canInterpretType as LDBaseDataType)}</>;
	}
	renderSingleKv(baseDT: LDBaseDataType): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
export function wrapBaseDataTypeGDSF(cfg: BlueprintConfig) {
	return (
		nextProps: LDConnectedState & LDConnectedDispatch & OwnProps,
		prevState: BaseDataTypeState & LDLocalState) => {
		let rvLD = gdsfpLD(nextProps, prevState, [], [LDDict.description, UserDefDict.inputData, UserDefDict.outputKVMapKey], cfg.canInterpretType);
		if (!rvLD) return null;
		let rvLocal: BaseDataTypeState = null;
		if (nextProps.ldOptions) {
			let pLdOpts: ILDOptions = nextProps.ldOptions;
			let newSingleKVKey: string = determineSingleKVKey(pLdOpts.resource.kvStores, cfg.canInterpretType, cfg.interpretableKeys as string[]);
			let nextDescription = rvLD.localValues.get(LDDict.description);
			let nextSingleKV = getKVStoreByKey(pLdOpts.resource.kvStores, newSingleKVKey);
			if (!nextSingleKV) {
				//this happens when state changes let this comp re-evaluate before it's being replaced. Do nothing
				return null;
			}
			let desc = nextDescription ? nextDescription : newSingleKVKey;
			rvLD.localLDTypes.set(newSingleKVKey, nextSingleKV.ldType);
			rvLD.localValues.set(newSingleKVKey, nextSingleKV.value);
			rvLD.localLDTypes.set(LDDict.description, LDDict.Text);
			rvLD.localValues.set(LDDict.description, desc);
			let singleKVOutputKeyStr: string = UserDefDict.outputData;
			if (newSingleKVKey !== UserDefDict.inputData) singleKVOutputKeyStr = newSingleKVKey;
			rvLocal = { singleKVOutput: nextSingleKV, singleKVInputKey: newSingleKVKey, singleKVOutputKey: singleKVOutputKeyStr };
		}
		if (!rvLocal) return null;
		return { ...prevState, ...rvLD, ...rvLocal };
	};
}
