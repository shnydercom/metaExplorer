import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDLocalState } from 'appstate/LDProps';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';

export var TitleTextAndImageName: string = "shnyder/TitleTextAndImage";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.freeContainer, VisualKeysDict.headerTxt, VisualKeysDict.description];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
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
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: TitleTextAndImageName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureTitleTextAndImage extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState)
		: null | LDLocalState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualKeysDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [VisualKeysDict.headerTxt, VisualKeysDict.description]);
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
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[VisualKeysDict.freeContainer],
				[VisualKeysDict.headerTxt, VisualKeysDict.description])
		};
	}
	render() {
		const { localValues } = this.state;
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const description = localValues.get(VisualKeysDict.description);
		return <div className="flex-container" style={{flexDirection: "column-reverse"}}>
			<div className="flex-filler" style={{minHeight: "300px"}}>
				{this.renderSub(VisualKeysDict.freeContainer)}
			</div>
			<div className="flex-filler vh-centered-column" style={{minHeight: "300px"}}>
				<h2>{headerText ? headerText : 'headerTextPlaceholder'}</h2>
				<span> </span>
				<p>{description ? description : 'descriptionPlaceholder'}</p>
			</div>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureTitleTextAndImage);
