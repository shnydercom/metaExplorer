import React from 'react';
import {
	LDDict, KVL, ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	ILDOptions, VisualKeysDict, UserDefDict, LDOwnProps,
	LDConnectedDispatch, LDConnectedState, LDLocalState,
	gdsfpLD, initLDLocalState, fontIcon, isIcon,
} from '@metaexplorer/core';
import { Component } from 'react';
import { Button } from '@material-ui/core';
import { copyToClipboard } from '../../../utils/copyToClipboard';

export const MDCopyButtonName: string = "metaexplorer.io/material-design/CopyButton";
let cfgRegularInputKeys: string[] = [
	UserDefDict.inputData,
	VisualKeysDict.copyTxt,
	fontIcon,
	isIcon,
];
let ownKVLs: KVL[] = [
	{
		key: UserDefDict.inputData,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.copyTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: fontIcon,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: isIcon,
		value: undefined,
		ldType: LDDict.Boolean
	},
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MDCopyButtonName,
	ownKVLs: ownKVLs,
	inKeys: cfgRegularInputKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureMDCopyButton extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState)
		: null | LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], [...cfgRegularInputKeys]);
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
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[],
				[...cfgRegularInputKeys])
		};
	}
	render() {
		const { localValues } = this.state;
		const textToCopy = localValues.get(UserDefDict.inputData);
		const copyTxt = localValues.get(VisualKeysDict.copyTxt);
		const localFontIcon = localValues.get(fontIcon);
		const localIsIcon = localValues.get(isIcon);
		return this.renderButton(localIsIcon, localFontIcon, copyTxt, textToCopy);
	}

	onCopyBtnClick = () => {
		const { localValues } = this.state;
		const inputData = localValues.get(UserDefDict.inputData);
		if (inputData) {
			copyToClipboard(inputData);
		}
	}

	protected renderButton(isIconVal: boolean, iconUrlVal: string, copyTxt: string, textToCopy: string) {
		return <Button
		disabled={!textToCopy}
			onClick={() => this.onCopyBtnClick()}>
			{iconUrlVal ? <img src={iconUrlVal} /> : null}
			{!isIconVal && copyTxt && "copy"}
		</Button>;
	}

}
