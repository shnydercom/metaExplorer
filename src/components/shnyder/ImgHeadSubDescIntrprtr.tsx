import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState } from 'appstate/LDProps';
import { gdsfpLD, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';

export var ImgHeadSubDescIntrprtrName: string = "shnyder/ImgHeadSubDescIntrprtr";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.primaryItpt, VisualKeysDict.headerTxt, VisualKeysDict.subHeaderTxt, VisualKeysDict.description, VisualKeysDict.secondaryItpt];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.primaryItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.subHeaderTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.secondaryItpt,
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
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.primaryItpt, VisualKeysDict.secondaryItpt], [VisualKeysDict.headerTxt, VisualKeysDict.subHeaderTxt, VisualKeysDict.description]);
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
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		console.log("ImgHeadSubDesc Constructor called");
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[VisualKeysDict.primaryItpt, VisualKeysDict.secondaryItpt],
				[VisualKeysDict.headerTxt, VisualKeysDict.subHeaderTxt, VisualKeysDict.description])
		};
	}
	render() {
		const { localValues } = this.state;
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const subHeaderText = localValues.get(VisualKeysDict.subHeaderTxt);
		const description = localValues.get(VisualKeysDict.description);
		return <div className="mdscrollbar">
			<div className="header-img-container">
				{this.renderSub(VisualKeysDict.primaryItpt)}
			</div>
			<div className="header-img-container gradient">
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
				{this.renderSub(VisualKeysDict.secondaryItpt)}
			</div>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgHeadSubDesc);
