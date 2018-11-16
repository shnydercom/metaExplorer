import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState } from 'appstate/LDProps';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import HeroGallery from 'metaexplorer-react-components/lib/components/hero/hero';

export var HeroGalleryName: string = "shnyder/HeroGallery";
const backgroundItpt = "backgroundPart";
const foregroundItpt = "foregroundPart";
const prevBtnLabel = "previousBtnLabel";
const nextBtnLabel = "nextBtnLabel";

let cfgIntrprtKeys: string[] =
	[backgroundItpt, foregroundItpt, prevBtnLabel, nextBtnLabel, VisualDict.headerTxt, VisualDict.subHeaderTxt];
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
		console.log("gdsfp");
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [cfgIntrprtKeys[0], cfgIntrprtKeys[1]], [true, true]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [cfgIntrprtKeys[2], cfgIntrprtKeys[3], cfgIntrprtKeys[4], cfgIntrprtKeys[5]], [true, true, false, false]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		let galFrontItems = rvLD.compInfos.get(cfgIntrprtKeys[1]);
		let numGalleryItems = galFrontItems ? (galFrontItems as []).length : 0;
		return {
			...prevState, ...rvLD, ...rvLocal,
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
		console.log("init");
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
		const subHeaderTextStr: string = localValues.get(VisualDict.subHeaderTxt);
		const topHeaderTextStr: string = localValues.get(VisualDict.headerTxt);
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
		/*return <div className="hero-gallery">
			<div className="bg-container">
				{this.renderSub(backgroundItpt)}
			</div>
			<div className="hero-front-outer overlay-gradient">
				<div className="hero-front-inner" ref="innerDiv">
					<div>
						<div className="fg-container">
							{this.renderSub(foregroundItpt)}
						</div>
						<div className="btns">
							<div className="prev">
								<div className="start"></div>
								<div className="mid">{prevBtnLabelStrings}</div>
								<div className="end"></div>
							</div>
							<div className="nxt">
								<div className="start"></div>
								<div className="mid">{nxtBtnLabelStrings}</div>
								<div className="end"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="hero-text">
				<h4>{subHeaderTextStr}</h4>
			</div>
		</div>;*/
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureHeroGallery);
