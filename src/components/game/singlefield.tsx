import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDRouteProps, LDLocalState } from 'appstate/LDProps';
import { gdsfpLD, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';

import Ripple from 'react-toolbox/lib/ripple';

type OwnProps = {
	test: string;
};
type ConnectedState = {
	test: string;
};

type ConnectedDispatch = {
	test: string;
};

export var SingleFieldViewIntrprtrName: string = "game/SingleFieldView";
let cfgType: string = SingleFieldViewIntrprtrName;
let cfgIntrprtKeys: string[] =
	[
		VisualKeysDict.headerTxt
	];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: SingleFieldViewIntrprtrName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

interface SingleFieldViewState {
}
@ldBlueprint(bpCfg)
export class PureSingleFieldView extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SingleFieldViewState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState & SingleFieldViewState)
		: null | LDLocalState & SingleFieldViewState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [
			], [
				VisualKeysDict.headerTxt
			]);
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
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			...initLDLocalState(this.cfg, props,
				[
				],
				[
					VisualKeysDict.headerTxt
				])
		};
	}

	ripplefn = (props) => (
		<a {...props} style={{ position: 'relative' }}>
			{props.children}
		</a>
	)

	render() {
		const { localValues } = this.state;
		const headerTxt = localValues.get(VisualKeysDict.headerTxt);
		const RippleLink = Ripple({ spread: 3 })(this.ripplefn);
		return <div className="game-field">
			<RippleLink >{headerTxt}</RippleLink>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureSingleFieldView);
