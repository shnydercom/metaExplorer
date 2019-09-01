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
import { debounce } from 'debounce';

/**
 * @author Jonathan Schneider
 * for each Base Data Type an itpt is being configured, the React-Part
 * of the itpt is the same for all Base Data Types
 */

type OwnProps = {
	//singleKV: IKvStore; //TODO: doesn't seem to be used any more as react-prop
} & LDOwnProps;

type BaseDataTypeState = {
	singleKVInput: IKvStore,
	singleKVInputKey: string,
	singleKVOutputKey: string,
	isDispatched: boolean
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

	protected dispatchDebounced = debounce((
		modSingleKV, ldTokenString, outputKVMap
	) => {
		this.setState({ ...this.state, singleKVInput: modSingleKV, isDispatched: true });
		this.props.dispatchKvOutput([modSingleKV], ldTokenString, outputKVMap);
	}, 400);

	constructor(props?: LDConnectedState & LDConnectedDispatch & OwnProps) {
		super(props);
		this.cfg = this.constructor["cfg"];
		let bdtState: BaseDataTypeState = {
			singleKVInput: null,
			singleKVInputKey: UserDefDict.inputData,
			singleKVOutputKey: UserDefDict.outputData,
			isDispatched: true
		};
		this.state = {
			...bdtState,
			...initLDLocalState(
				this.cfg, props,
				[],
				[LDDict.description, UserDefDict.inputData, UserDefDict.outputKVMapKey])
		};
		this.state = {
			...this.state, singleKVInput:
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
		let modSingleKVOutput: IKvStore = {
			key: this.state.singleKVOutputKey,
			ldType: this.state.localLDTypes.get(singleInputKey),
			value: this.state.localValues.get(singleInputKey)
		};
		if (typeof evtval === 'string') {
			switch (modSingleKVOutput.ldType) {
				case LDDict.Boolean:
					evtval = (evtval === 'true');
					break;
				case LDDict.Integer:
					evtval = parseInt(evtval, 10);
					break;
				case LDDict.Double:
					evtval = parseFloat(evtval);
					break;
				case LDDict.Date:
					evtval = new Date(evtval);
					break;
				case LDDict.DateTime:
					evtval = new Date(evtval);
					break;
				default:
					break;
			}
		}
		modSingleKVOutput.value = evtval;
		const modSingleKvInput = this.state.singleKVInput;
		modSingleKvInput.value = evtval;
		this.setState({ ...this.state, singleKVInput: modSingleKvInput, isDispatched: false }, () => {
			const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
			if (!outputKVMap || !outputKVMap[this.state.singleKVOutputKey]) return;
			this.dispatchDebounced(modSingleKVOutput, this.props.ldTokenString, outputKVMap);
		}
		);
	}

	componentDidMount() {
		if (!this.state.singleKVInput || !this.state.singleKVInput.ldType) {
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
		if (!prevState.isDispatched) {
			//user input takes precedence, dispatching that before handling other input!
			return null;
		}
		let rvLD = gdsfpLD(nextProps, prevState, [], [LDDict.description, UserDefDict.inputData, UserDefDict.outputKVMapKey], cfg.canInterpretType);
		if (!rvLD) return null;
		let rvLocal: BaseDataTypeState = null;
		if (nextProps.ldOptions) {
			let pLdOpts: ILDOptions = nextProps.ldOptions;
			let newSingleKVInputKey: string = determineSingleKVKey(pLdOpts.resource.kvStores, cfg.canInterpretType, cfg.interpretableKeys as string[]);
			let nextDescription = rvLD.localValues.get(LDDict.description);
			let nextSingleInputKV = getKVStoreByKey(pLdOpts.resource.kvStores, newSingleKVInputKey);
			if (!nextSingleInputKV) {
				//this happens when state changes let this comp re-evaluate before it's being replaced. Do nothing
				return null;
			}
			let desc = nextDescription ? nextDescription : newSingleKVInputKey;
			rvLD.localLDTypes.set(newSingleKVInputKey, nextSingleInputKV.ldType);
			rvLD.localValues.set(newSingleKVInputKey, nextSingleInputKV.value);
			rvLD.localLDTypes.set(LDDict.description, LDDict.Text);
			rvLD.localValues.set(LDDict.description, desc);
			let singleKVOutputKeyStr: string = UserDefDict.outputData;
			let outputKvMap = getKVStoreByKey(pLdOpts.resource.kvStores, UserDefDict.outputKVMapKey);
			//i.e. inputKvStore is not set or it's dynamically generated
			if (newSingleKVInputKey !== UserDefDict.inputData) singleKVOutputKeyStr = newSingleKVInputKey;
			if (outputKvMap && outputKvMap.value) {
				if (outputKvMap.value.hasOwnProperty(UserDefDict.outputData)) {
					//unless outputData is explicitly set
					singleKVOutputKeyStr = UserDefDict.outputData;
				}
			}
			rvLocal = { singleKVInput: nextSingleInputKV, singleKVInputKey: newSingleKVInputKey, singleKVOutputKey: singleKVOutputKeyStr, isDispatched: true };
		}
		if (!rvLocal) return null;
		return { ...prevState, ...rvLD, ...rvLocal };
	};
}
