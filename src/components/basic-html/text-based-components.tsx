import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';

import { initLDLocalState, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { LDDict } from 'ldaccess/LDDict';

let cfgIntrprtKeys: string[] =
	[UserDefDict.singleKvStore];
let initialKVStores: IKvStore[] = [
	{
		key: UserDefDict.singleKvStore,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const createTextBasedBpCfg: (nameSelf: string) => BlueprintConfig = (nameSelf: string) => {
	return {
		subItptOf: null,
		nameSelf: nameSelf,
		initialKvStores: initialKVStores,
		interpretableKeys: cfgIntrprtKeys,
		crudSkills: "cRud",
		canInterpretType: LDDict.Text
	};
};

export interface TextBasedComponentState extends LDLocalState {
}

export abstract class PureTextBasedComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, TextBasedComponentState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: TextBasedComponentState): null | TextBasedComponentState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [UserDefDict.singleKvStore]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let rvNew = { ...rvLD, ...rvLocal };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [],
			[UserDefDict.singleKvStore]);
		this.state = {
			...ldState,
		};
	}
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <div>{singleTextValue ? singleTextValue : null}</div>;
	}
}

export const H1TextComponentName = 'shnyder/basichtml/h1';
@ldBlueprint(createTextBasedBpCfg(H1TextComponentName))
export class PureH1TextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <h1>{singleTextValue ? singleTextValue : null}</h1>;
	}
}

export const H2TextComponentName = 'shnyder/basichtml/h2';
@ldBlueprint(createTextBasedBpCfg(H2TextComponentName))
export class PureH2TextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <h2>{singleTextValue ? singleTextValue : null}</h2>;
	}
}

export const H3TextComponentName = 'shnyder/basichtml/h3';
@ldBlueprint(createTextBasedBpCfg(H3TextComponentName))
export class PureH3TextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <h3>{singleTextValue ? singleTextValue : null}</h3>;
	}
}

export const H4TextComponentName = 'shnyder/basichtml/h4';
@ldBlueprint(createTextBasedBpCfg(H4TextComponentName))
export class PureH4TextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <h4>{singleTextValue ? singleTextValue : null}</h4>;
	}
}

export const SpanTextComponentName = 'shnyder/basichtml/span';
@ldBlueprint(createTextBasedBpCfg(SpanTextComponentName))
export class PureSpanTextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <span>{singleTextValue ? singleTextValue : null}</span>;
	}
}

export const BoldTextComponentName = 'shnyder/basichtml/bold';
@ldBlueprint(createTextBasedBpCfg(BoldTextComponentName))
export class PureBoldTextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <b>{singleTextValue ? singleTextValue : null}</b>;
	}
}

export const ItalicsTextComponentName = 'shnyder/basichtml/italics';
@ldBlueprint(createTextBasedBpCfg(ItalicsTextComponentName))
export class PureItalicsTextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <i>{singleTextValue ? singleTextValue : null}</i>;
	}
}

export const ParagraphTextComponentName = 'shnyder/basichtml/paragraph';
@ldBlueprint(createTextBasedBpCfg(ParagraphTextComponentName))
export class PureParagraphTextComponent extends PureTextBasedComponent {
	render() {
		const {localValues} = this.state;
		const singleTextValue = localValues.get(UserDefDict.singleKvStore);
		return <p>{singleTextValue ? singleTextValue : null}</p>;
	}
}
