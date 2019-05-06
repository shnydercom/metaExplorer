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
import { Component, ComponentClass, StatelessComponent, CSSProperties } from 'react';

export var TitleTextAndImageName: string = "shnyder/TitleTextAndImage";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, VisualKeysDict.headerTxt, VisualKeysDict.description, VisualKeysDict.directionChangeBreakPoint, VisualKeysDict.switchVerticalDirection, VisualKeysDict.switchHorizontalDirection];
let initialKVStores: IKvStore[] = [
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
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
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
	initialKvStores: IKvStore[];

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
		return <div className="flex-container"
			ref={(divElement) => this.divElement = divElement}
			style={directionStyle}>
			<div className="flex-filler vh-centered-column" style={{ minHeight: DEFAULT_BREAKPOINT }}>
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
			<div className="flex-filler vh-centered-column" style={{ minHeight: "300px" }}>
				<h2>{headerText ? headerText : ''}</h2>
				<span> </span>
				<p>{description ? description : ''}</p>
			</div>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureTitleTextAndImage);
