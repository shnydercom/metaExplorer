import React from 'react';
import {
	LDDict, KVL, ILDOptions, VisualKeysDict, gdsfpLD, initLDLocalState,
	ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState
} from '@metaexplorer/core';
import { Component } from 'react';

import { Menu, Item } from "react-gooey-nav";

export var GooeyNavName: string = "metaexplorer.io/GooeyNav";
export const centralIcon: string = "centralIcon";
let cfgIntrprtKeys: string[] =
	[centralIcon, VisualKeysDict.iconName];
let ownKVLs: KVL[] = [
	{
		key: centralIcon,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.iconName,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: GooeyNavName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureGooeyNav extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState)
		: null | LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], [centralIcon, VisualKeysDict.iconName], null, [false, true]);
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

	//private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[],
				[centralIcon, VisualKeysDict.iconName],
				[],
				[false, true])
		};
	}
	render() {
		// const { localValues } = this.state;
		//const centralIconTxt = localValues.get(centralIcon);
		//const iconNames: string[] = localValues.get(VisualKeysDict.iconName);
		/*return <div className="flex-container" style={{ flexDirection: "column-reverse" }}>
			<div className="flex-filler" style={{ minHeight: "300px" }}>
				{iconNames ? <Menu orientation="bottom" >
					{
						iconNames.map((iconName) => {
							return <Item title="Cool!">
								<FontIcon value={iconName} />
							</Item>;
						})
					}
				</Menu>
					: null*/
		return <Menu orientation="bottom">
			<Item title="c">
				EN
			</Item>
			<Item title="c">
				DE
			</Item>
		</Menu >;
		/*
			<Item title="a">
				<FontIcon value="translate" />
			</Item>
			<Item title="b">
				<FontIcon value="language" />
			</Item>
			<Item title="c">
				<FontIcon value="中文" />
			</Item>
			*/
	}

}
