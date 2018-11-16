import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState } from 'appstate/LDProps';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';

import { Menu, Item } from "react-gooey-nav";
import { FontIcon } from 'react-toolbox/lib/font_icon';

export var GooeyNavName: string = "shnyder/GooeyNav";
export const centralIcon: string = "centralIcon";
let cfgIntrprtKeys: string[] =
	[centralIcon, VisualDict.iconName];
let initialKVStores: IKvStore[] = [
	{
		key: centralIcon,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.iconName,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: GooeyNavName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureGooeyNav extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState)
		: null | LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, []);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [centralIcon, VisualDict.iconName], [false, true]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		return {
			...prevState, ...rvLD, ...rvLocal
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		console.log("GooeyNav Constructor called");
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[],
				[centralIcon, VisualDict.iconName],
				[],
				[false, true])
		};
	}
	render() {
		const { localValues } = this.state;
		const centralIconTxt = localValues.get(centralIcon);
		const iconNames: string[] = localValues.get(VisualDict.iconName);
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
			<Item title="a">
				<FontIcon value="translate" />
			</Item>
			<Item title="b">
				<FontIcon value="language" />
			</Item>
			<Item title="c">
				<FontIcon value="中文" />
			</Item>
			<Item title="c">
				EN
			</Item>
			<Item title="c">
				DE
			</Item>
		</Menu >
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureGooeyNav);
