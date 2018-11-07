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

export var ImgHeadSubDescIntrprtrName: string = "shnyder/ImgHeadSubDescIntrprtr";
let cfgIntrprtKeys: string[] =
	[VisualDict.headerItpt, VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description, VisualDict.footerItpt];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.headerItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.subHeaderTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.footerItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ImgHeadSubDescIntrprtrName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureImgHeadSubDesc extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState)
		: null | LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualDict.headerItpt, VisualDict.footerItpt]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description]);
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
		console.log("ImgHeadSubDesc Constructor called");
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[VisualDict.headerItpt, VisualDict.footerItpt],
				[VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description])
		};
	}
	render() {
		const { localValues } = this.state;
		const headerText = localValues.get(VisualDict.headerTxt);
		const subHeaderText = localValues.get(VisualDict.subHeaderTxt);
		const description = localValues.get(VisualDict.description);
		return <div className="mdscrollbar">
			<div className="header-img-container">
				{this.renderSub(VisualDict.headerItpt)}
			</div>
			<div className="header-img-container overlay-gradient">
				<div className="header-text">
					<span>{headerText ? headerText : 'headerTextPlaceholder'}</span>
				</div>
			</div>
			<div className="imgheadsubdesc-text">
				<div>
					<h4>{subHeaderText ? subHeaderText : "subHeaderTextPlaceholder"}</h4>
				</div>
				<div>
					<i>{description ? description : 'descriptionPlaceholder'}</i>
				</div>
			</div>
			<div>
				{this.renderSub(VisualDict.footerItpt)}
			</div>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgHeadSubDesc);
