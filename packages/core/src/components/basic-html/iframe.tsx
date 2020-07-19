import React from 'react';
import { IKvStore } from '../../ldaccess/ikvstore';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';

import { initLDLocalState, gdsfpLD } from '../generic/generatorFns';
import { Component } from 'react';
import { LDDict } from '../../ldaccess/LDDict';
import { LDUIDictVerbs, UserDefDict } from '../../ldaccess';
import { VisualKeysDict } from '../visualcomposition';

let cfgIntrprtKeys: string[] =
	[LDUIDictVerbs.htmlSrc, VisualKeysDict.cssClassName];
let ownKVL: IKvStore[] = [
	{
		key: LDUIDictVerbs.htmlSrc,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	}
];

export const CORE_IFRAME_NAME = "metaexplorer.io/basichtml/iframe";

const iframeBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: CORE_IFRAME_NAME,
	ownKVL: ownKVL,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud",
	canInterpretType: CORE_IFRAME_NAME + UserDefDict.standardItptObjectTypeSuffix
};

export const CORE_IFRAME_CFG = { ...iframeBpCfg };

export interface IFrameState extends LDLocalState {
}

@ldBlueprint(CORE_IFRAME_CFG)
export class PureIFrameComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, IFrameState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: IFrameState): null | IFrameState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], cfgIntrprtKeys, null, [], [true]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVL: IKvStore[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [],
			cfgIntrprtKeys, [], [true]);
		this.state = {
			...ldState,
		};
	}

	render() {
		const { localValues } = this.state;
		const htmlSrc = localValues.get(LDUIDictVerbs.htmlSrc);
		const cssClassName = localValues.get(VisualKeysDict.cssClassName);
		return <iframe src={htmlSrc} className={cssClassName}></iframe>;
	}
}
