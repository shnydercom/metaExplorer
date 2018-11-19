import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDRouteProps, LDLocalState } from 'appstate/LDProps';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
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
		VisualDict.headerTxt
	];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.headerTxt,
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
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [
			]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [
				VisualDict.headerTxt
			]);
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
				[
				],
				[
					VisualDict.headerTxt
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
		const headerTxt = localValues.get(VisualDict.headerTxt);
		const RippleLink = Ripple({ spread: 3 })(this.ripplefn);
		return <div className="game-field">
			<RippleLink >{headerTxt}</RippleLink>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureSingleFieldView);
