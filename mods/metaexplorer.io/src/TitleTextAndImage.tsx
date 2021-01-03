import React from 'react';
import {
	LDDict, KVL, gdsfpLD, generateItptFromCompInfo, initLDLocalState,
	ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	ILDOptions, VisualKeysDict, UserDefDict, LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState
} from '@metaexplorer/core';
import { Component, CSSProperties } from 'react';

export const CSS_BASECLASS = "titletextandimage";
export var TitleTextAndImageName: string = "metaexplorer.io/TitleTextAndContainer";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, VisualKeysDict.headerTxt, VisualKeysDict.description, VisualKeysDict.directionChangeBreakPoint, VisualKeysDict.switchVerticalDirection, VisualKeysDict.switchHorizontalDirection];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.directionChangeBreakPoint,
		value: undefined,
		ldType: LDDict.Integer
	},
	{
		key: VisualKeysDict.switchVerticalDirection,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: VisualKeysDict.switchHorizontalDirection,
		value: undefined,
		ldType: LDDict.Boolean
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: TitleTextAndImageName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

const DEFAULT_BREAKPOINT = 350;

interface TitleTextAndImageState {
	isHorizontal: boolean;
}
@ldBlueprint(bpCfg)
export class PureTitleTextAndImage extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState & TitleTextAndImageState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState & TitleTextAndImageState)
		: null | LDLocalState & TitleTextAndImageState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], [VisualKeysDict.headerTxt, VisualKeysDict.description, VisualKeysDict.directionChangeBreakPoint, VisualKeysDict.switchVerticalDirection, VisualKeysDict.switchHorizontalDirection]);
		if (!rvLD) {
			return null;
		}
		return {
			...prevState, ...rvLD
		};
	}

	divElement = null;

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			isHorizontal: false,
			...initLDLocalState(this.cfg, props,
				[VisualKeysDict.inputContainer],
				[VisualKeysDict.headerTxt, VisualKeysDict.description, VisualKeysDict.directionChangeBreakPoint, VisualKeysDict.switchVerticalDirection, VisualKeysDict.switchHorizontalDirection])
		};
	}

	determineDirection() {
		const width = this.divElement.clientWidth;
		let directionChangeBreakPoint = this.state.localValues.get(VisualKeysDict.directionChangeBreakPoint);
		directionChangeBreakPoint = directionChangeBreakPoint ? directionChangeBreakPoint : DEFAULT_BREAKPOINT;
		if (width > directionChangeBreakPoint && !this.state.isHorizontal) {
			this.setState({ ...this.state, isHorizontal: true });
		}
		if (width < directionChangeBreakPoint && this.state.isHorizontal) {
			this.setState({ ...this.state, isHorizontal: false });
		}
	}

	componentDidMount() {
		this.determineDirection();
	}
	componentDidUpdate() {
		this.determineDirection();
	}

	render() {
		const { localValues, isHorizontal } = this.state;
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const description = localValues.get(VisualKeysDict.description);
		const switchVertical = localValues.get(VisualKeysDict.switchVerticalDirection);
		const switchHorizontal = localValues.get(VisualKeysDict.switchHorizontalDirection);
		const directionStyle: CSSProperties = isHorizontal
			? switchHorizontal ? { flexDirection: "row" } : { flexDirection: "row-reverse" }
			: switchVertical ? { flexDirection: "column" } : { flexDirection: "column-reverse" };
		const switcherCSSclassName = isHorizontal
			? switchHorizontal ? "row" : "row-reverse"
			: switchVertical ? "column" : "column-reverse";
		return <div className={`flex-container ${CSS_BASECLASS} ${switcherCSSclassName}`}
			ref={(divElement) => this.divElement = divElement}
			style={directionStyle}>
			<div className={`flex-filler vh-centered-column ${CSS_BASECLASS}-inputcontainer`} style={{ minHeight: DEFAULT_BREAKPOINT }}>
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
			<div className={`flex-filler vh-centered-column ${CSS_BASECLASS}-textcontainer`} style={{ minHeight: "300px" }}>
				<h2 className={`${CSS_BASECLASS}-heading`}>{headerText ? headerText : ''}</h2>
				<p className={`${CSS_BASECLASS}-text`}>{description ? description : ''}</p>
			</div>
		</div>;
	}

}
