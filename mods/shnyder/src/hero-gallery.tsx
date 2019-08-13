import React from 'react';
import {
	LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState,
	gdsfpLD, generateItptFromCompInfo, initLDLocalState, LDDict, IKvStore,
	ldBlueprint, ILDOptions, VisualKeysDict, UserDefDict, BlueprintConfig, IBlueprintItpt, OutputKVMap
} from '@metaexplorer/core';
import { Component } from 'react';
import HeroGallery from 'metaexplorer-react-components/lib/components/hero/hero';

export var HeroGalleryName: string = "shnyder/HeroGallery";
const backgroundItpt = "backgroundPart";
const foregroundItpt = "foregroundPart";
const prevBtnLabel = "previousBtnLabel";
const nextBtnLabel = "nextBtnLabel";

let cfgIntrprtKeys: string[] =
	[backgroundItpt, foregroundItpt, prevBtnLabel, nextBtnLabel, VisualKeysDict.headerTxt, VisualKeysDict.subHeaderTxt];
let initialKVStores: IKvStore[] = [
	{
		key: cfgIntrprtKeys[0],
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: cfgIntrprtKeys[1],
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: cfgIntrprtKeys[2],
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: cfgIntrprtKeys[3],
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: cfgIntrprtKeys[4],
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: cfgIntrprtKeys[5],
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: HeroGalleryName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export interface HeroGalleryState extends LDLocalState {
	displayIdx: number;
	numGalleryItems: number;
}

@ldBlueprint(bpCfg)
export class PureHeroGallery extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, HeroGalleryState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | HeroGalleryState)
		: null | HeroGalleryState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [cfgIntrprtKeys[0], cfgIntrprtKeys[1]],
			[cfgIntrprtKeys[2], cfgIntrprtKeys[3], cfgIntrprtKeys[4], cfgIntrprtKeys[5]],
			null,
			[true, true], [true, true, false, false]);
		if (!rvLD) {
			return null;
		}
		let galFrontItems = rvLD.compInfos.get(cfgIntrprtKeys[1]);
		let numGalleryItems = galFrontItems ? (galFrontItems as []).length : 0;
		return {
			...prevState, ...rvLD,
			numGalleryItems
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			numGalleryItems: 0,
			displayIdx: 0,
			...initLDLocalState(this.cfg, props,
				[cfgIntrprtKeys[0], cfgIntrprtKeys[1]],
				[cfgIntrprtKeys[2], cfgIntrprtKeys[3], cfgIntrprtKeys[4], cfgIntrprtKeys[5]],
				[true, true],
				[true, true, false, false])
		};
	}

	onGalleryLeftClick() {
		let newDisplayIdx = this.state.displayIdx - 1;
		newDisplayIdx = newDisplayIdx < 0 ? this.state.numGalleryItems - 1 : newDisplayIdx;
		this.setState({ ...this.state, displayIdx: newDisplayIdx });
	}

	onGalleryRightClick() {
		let newDisplayIdx = this.state.displayIdx + 1;
		newDisplayIdx = newDisplayIdx >= this.state.numGalleryItems ? 0 : newDisplayIdx;
		this.setState({ ...this.state, displayIdx: newDisplayIdx });
	}

	render() {
		const { localValues, displayIdx } = this.state;
		const { routes } = this.props;
		const prevBtnLabelStrings: string[] = localValues.get(prevBtnLabel);
		const nxtBtnLabelStrings: string[] = localValues.get(nextBtnLabel);
		const subHeaderTextStr: string = localValues.get(VisualKeysDict.subHeaderTxt);
		const topHeaderTextStr: string = localValues.get(VisualKeysDict.headerTxt);
		return <HeroGallery
			backgroundComp={this.renderSub(backgroundItpt, routes, displayIdx)}
			foregroundComp={this.renderSub(foregroundItpt, routes, displayIdx)}
			leftBtnLabel={prevBtnLabelStrings[displayIdx]}
			rightBtnLabel={nxtBtnLabelStrings[displayIdx]}
			onLeftBtnClick={() => this.onGalleryLeftClick()}
			onRightBtnClick={() => this.onGalleryRightClick()}
			topHeader={topHeaderTextStr}
			subHeader={subHeaderTextStr}
		>

		</HeroGallery>;
	}

}
