import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict } from '../visualcomposition/visualDict';

import { initLDLocalState, generateItptFromCompInfo, getDerivedItptStateFromProps, getDerivedKVStateFromProps } from '../generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import CircleView from 'metaexplorer-react-components/lib/components/circle/circleview';

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.freeContainer];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];
export const createLayoutBpCfg: (nameSelf: string) => BlueprintConfig = (nameSelf: string) => {
	return {
		subItptOf: null,
		nameSelf: nameSelf,
		initialKvStores: initialKVStores,
		interpretableKeys: cfgIntrprtKeys,
		crudSkills: "cRud"
	};
};

export interface LayoutComponentState extends LDLocalState {
}

export abstract class PureLayoutComponent extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LayoutComponentState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: LayoutComponentState): null | LayoutComponentState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [VisualKeysDict.freeContainer]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, []);
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
	styleClassName: string;

	protected renderFreeContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.freeContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.freeContainer],
			[]);
		this.state = {
			...ldState,
		};
	}
	render() {
		return <div className={this.styleClassName}>{this.renderFreeContainer()}</div>;
	}
}

export const LayoutVHCenteredColumnName = 'shnyder/layout/vh-centered-column';
@ldBlueprint(createLayoutBpCfg(LayoutVHCenteredColumnName))
export class PureVHcenteredColumnLayout extends PureLayoutComponent {
	styleClassName = "vh-centered-column";
}

export const LayoutCircleDisplayName = 'shnyder/layout/circle-display';
@ldBlueprint(createLayoutBpCfg(LayoutCircleDisplayName))
export class PureCircleLayout extends PureLayoutComponent {
	styleClassName = ""; //can be set, default behaviour is centering vertically and horizontally
	render() {
		return <CircleView>{this.renderFreeContainer()}</CircleView>;
	}
}

//export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureVHcenteredColumnLayout);
