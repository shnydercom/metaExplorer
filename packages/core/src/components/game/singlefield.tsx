import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState } from 'appstate/LDProps';
import { gdsfpLD, initLDLocalState } from 'components/generic/generatorFns';
import { Component } from 'react';
import React from 'react';

export var SingleFieldViewIntrprtrName: string = "game/SingleFieldView";
let cfgIntrprtKeys: string[] =
	[
		VisualKeysDict.headerTxt
	];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SingleFieldViewIntrprtrName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

interface SingleFieldViewState {
}
@ldBlueprint(bpCfg)
export class PureSingleFieldView extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SingleFieldViewState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState & SingleFieldViewState)
		: null | LDLocalState & SingleFieldViewState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [
			], [
				VisualKeysDict.headerTxt
			]);
		if (!rvLD) {
			return null;
		}
		return {
			...prevState, ...rvLD
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[
				],
				[
					VisualKeysDict.headerTxt
				])
		};
	}

	render() {
		const { localValues } = this.state;
		const headerTxt = localValues.get(VisualKeysDict.headerTxt);
		return <div className="game-field">{headerTxt}</div>;
	}

}
