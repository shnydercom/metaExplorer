import React from "react";
import { KVL } from "../../ldaccess/KVL";
import {
	ldBlueprint,
	BlueprintConfig,
	IBlueprintItpt,
	OutputKVMap,
} from "../../ldaccess/ldBlueprint";
import { ILDOptions } from "../../ldaccess/ildoptions";
import {
	LDConnectedState,
	LDConnectedDispatch,
	LDOwnProps,
	LDLocalState,
} from "../../appstate/LDProps";
import { UserDefDict } from "../../ldaccess/UserDefDict";

import { initLDLocalState, gdsfpLD } from "../generic/generatorFns";
import { Component } from "react";
import { LDDict } from "../../ldaccess/LDDict";
import { VisualKeysDict } from "../visualcomposition";
import { cssClassNamePropFromLocalValues } from "../../GeneralUtils";

let cfgIntrprtKeys: string[] = [
	UserDefDict.inputData,
	VisualKeysDict.cssClassName,
];
let ownKVLs: KVL[] = [
	{
		key: UserDefDict.inputData,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text,
	},
];
export const createTextBasedBpCfg: (nameSelf: string) => BlueprintConfig = (
	nameSelf: string
) => {
	return {
		subItptOf: null,
		nameSelf: nameSelf,
		ownKVLs: ownKVLs,
		inKeys: cfgIntrprtKeys,
		crudSkills: "cRud",
		canInterpretType: LDDict.Text,
	};
};

export interface TextBasedComponentState extends LDLocalState {}

export abstract class PureTextBasedComponent
	extends Component<
		LDConnectedState & LDConnectedDispatch & LDOwnProps,
		TextBasedComponentState
	>
	implements IBlueprintItpt {
	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: TextBasedComponentState
	): null | TextBasedComponentState {
		let rvLD = gdsfpLD(
			nextProps,
			prevState,
			[],
			[UserDefDict.inputData, VisualKeysDict.cssClassName],
			null,
			[],
			[true, true]
		);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew,
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = this.constructor["cfg"] as BlueprintConfig;
		const ldState = initLDLocalState(
			this.cfg,
			props,
			[],
			[UserDefDict.inputData, VisualKeysDict.cssClassName],
			[],
			[true]
		);
		this.state = {
			...ldState,
		};
	}
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<div {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</div>
		);
	}
}

export const H1TextComponentName = "metaexplorer.io/basichtml/h1";
@ldBlueprint(createTextBasedBpCfg(H1TextComponentName))
export class PureH1TextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<h1 {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</h1>
		);
	}
}

export const H2TextComponentName = "metaexplorer.io/basichtml/h2";
@ldBlueprint(createTextBasedBpCfg(H2TextComponentName))
export class PureH2TextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<h2 {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</h2>
		);
	}
}

export const H3TextComponentName = "metaexplorer.io/basichtml/h3";
@ldBlueprint(createTextBasedBpCfg(H3TextComponentName))
export class PureH3TextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<h3 {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</h3>
		);
	}
}

export const H4TextComponentName = "metaexplorer.io/basichtml/h4";
@ldBlueprint(createTextBasedBpCfg(H4TextComponentName))
export class PureH4TextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<h4 {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</h4>
		);
	}
}

export const SpanTextComponentName = "metaexplorer.io/basichtml/span";
@ldBlueprint(createTextBasedBpCfg(SpanTextComponentName))
export class PureSpanTextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<span {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</span>
		);
	}
}

export const BoldTextComponentName = "metaexplorer.io/basichtml/bold";
@ldBlueprint(createTextBasedBpCfg(BoldTextComponentName))
export class PureBoldTextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<b {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</b>
		);
	}
}

export const ItalicsTextComponentName = "metaexplorer.io/basichtml/italics";
@ldBlueprint(createTextBasedBpCfg(ItalicsTextComponentName))
export class PureItalicsTextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<i {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</i>
		);
	}
}

export const ParagraphTextComponentName = "metaexplorer.io/basichtml/paragraph";
@ldBlueprint(createTextBasedBpCfg(ParagraphTextComponentName))
export class PureParagraphTextComponent extends PureTextBasedComponent {
	render() {
		const { localValues } = this.state;
		const singleTextValue = localValues.get(UserDefDict.inputData);
		return (
			<p {...cssClassNamePropFromLocalValues(localValues)}>
				{singleTextValue ? singleTextValue : null}
			</p>
		);
	}
}
