import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDRouteProps, LDLocalState } from 'appstate/LDProps';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { elementAt } from 'rxjs/operators/elementAt';
import { generateIntrprtrForProp, getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { getKVValue, isObjPropertyRef } from 'ldaccess/ldUtils';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultItptRetriever';
import { ObjectPropertyRef } from 'ldaccess/ObjectPropertyRef';
import { appItptMatcherFn } from 'appconfig/appItptMatcher';
import { isReactComponent } from '../reactUtils/reactUtilFns';

type OwnProps = {
	test: string;
};
type ConnectedState = {
	test: string;
};

type ConnectedDispatch = {
	test: string;
};

export const GAME_TASK_HEADING = "GameTaskHeading";
export const GAME_TASK_TXT = "GameTaskText";
export const GAME_FIELD_ITPT_UL = "GameFieldItpt_UpperLeft";
export const GAME_FIELD_ITPT_UR = "GameFieldItpt_UpperRight";
export const GAME_FIELD_ITPT_LL = "GameFieldItpt_LowerLeft";
export const GAME_FIELD_ITPT_LR = "GameFieldItpt_LowerRight";
export const GAME_STATS = "GameStatsText";
export const GAME_CORRECT_FIELD_IDX = "GameField_Correct_idx";

export var FourFieldsViewIntrprtrName: string = "game/FourFieldsView";
let cfgType: string = FourFieldsViewIntrprtrName;
let cfgIntrprtKeys: string[] =
	[
		GAME_TASK_HEADING,
		GAME_TASK_TXT,
		GAME_FIELD_ITPT_UL,
		GAME_FIELD_ITPT_UR,
		GAME_FIELD_ITPT_LL,
		GAME_FIELD_ITPT_LR,
		GAME_STATS,
		VisualDict.freeContainer,
		GAME_CORRECT_FIELD_IDX
	];
let initialKVStores: IKvStore[] = [
	{ key: GAME_TASK_HEADING, value: undefined, ldType: LDDict.Text },
	{ key: GAME_TASK_TXT, value: undefined, ldType: LDDict.Text },
	{ key: GAME_FIELD_ITPT_UL, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: GAME_FIELD_ITPT_UR, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: GAME_FIELD_ITPT_LL, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: GAME_FIELD_ITPT_LR, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: GAME_STATS, value: undefined, ldType: LDDict.Text },
	{ key: VisualDict.freeContainer, value: undefined, ldType: UserDefDict.intrprtrClassType },
	{ key: GAME_CORRECT_FIELD_IDX, value: 0, ldType: LDDict.Integer }
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: FourFieldsViewIntrprtrName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

interface FourFieldsViewState {
	revealedArray: Array<boolean>;
}
@ldBlueprint(bpCfg)
export class PureFourFieldsView extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, FourFieldsViewState & LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | LDLocalState & FourFieldsViewState)
		: null | LDLocalState & FourFieldsViewState {
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, [
				GAME_FIELD_ITPT_UL,
				GAME_FIELD_ITPT_UR,
				GAME_FIELD_ITPT_LL,
				GAME_FIELD_ITPT_LR,
				VisualDict.freeContainer
			]);
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [
				GAME_TASK_HEADING,
				GAME_TASK_TXT,
				GAME_STATS,
				GAME_CORRECT_FIELD_IDX
			]);
		if (!rvLD && !rvLocal) {
			return null;
		}
		return { ...prevState, ...rvLD, ...rvLocal };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		console.log("FourFieldsView Constructor called");
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			revealedArray: [false, false, false, false],
			...initLDLocalState(this.cfg, props,
				[
					GAME_FIELD_ITPT_UL,
					GAME_FIELD_ITPT_UR,
					GAME_FIELD_ITPT_LL,
					GAME_FIELD_ITPT_LR,
					VisualDict.freeContainer
				],
				[
					GAME_TASK_HEADING,
					GAME_TASK_TXT,
					GAME_STATS,
					GAME_CORRECT_FIELD_IDX
				])
		};
	}

	onPressResult = (fieldIdx: number) => {
		const gamecorrectfieldidx = this.state.localValues.get(GAME_CORRECT_FIELD_IDX);
		let newRevealedArray = this.state.revealedArray.slice();
		newRevealedArray[fieldIdx] = true;
		if (fieldIdx === parseInt(gamecorrectfieldidx, 10)) {
			this.setState({ ...this.state, revealedArray: newRevealedArray });
			//TODO: do something
		} else {
			this.setState({ ...this.state, revealedArray: newRevealedArray });
		}
	}

	render() {
		const { localValues, revealedArray } = this.state;
		let gamecorrectfieldidx = this.state.localValues.get(GAME_CORRECT_FIELD_IDX);
		gamecorrectfieldidx = parseInt(gamecorrectfieldidx, 10);
		const gametaskheading = localValues.get(GAME_TASK_HEADING);
		const gametasktxt = localValues.get(GAME_TASK_TXT);
		const gamestats = localValues.get(GAME_STATS);

		let ulClassName = "game-4f-field-col ";
		ulClassName += revealedArray[0]
			? gamecorrectfieldidx === 0 ? "game-4f-correct" : "game-4f-wrong"
			: "game-4f-idle";
		let urClassName = "game-4f-field-col ";
		urClassName += revealedArray[1]
			? gamecorrectfieldidx === 1 ? "game-4f-correct" : "game-4f-wrong"
			: "game-4f-idle";
		let llClassName = "game-4f-field-col ";
		llClassName += revealedArray[2]
			? gamecorrectfieldidx === 2 ? "game-4f-correct" : "game-4f-wrong"
			: "game-4f-idle";
		let lrClassName = "game-4f-field-col ";
		lrClassName += revealedArray[3]
			? gamecorrectfieldidx === 3 ? "game-4f-correct" : "game-4f-wrong"
			: "game-4f-idle";
		let mainGameClassName = "game-4f-base ";
		return <div className={mainGameClassName}>
			<div className="game-4f-top">
				<h3>{gametaskheading}</h3>
				<span>{gametasktxt}</span>
			</div>
			<div className="game-4f-fields">
				<div className="game-4f-field-row">
					<div className={ulClassName} onClick={() => this.onPressResult(0)}>
						{this.renderSub(GAME_FIELD_ITPT_UL)}
					</div>
					<div className={urClassName} onClick={() => this.onPressResult(1)}>
						{this.renderSub(GAME_FIELD_ITPT_UR)}
					</div>
				</div>
				<div className="game-4f-field-row" >
					<div className={llClassName} onClick={() => this.onPressResult(2)}>
						{this.renderSub(GAME_FIELD_ITPT_LL)}
					</div>
					<div className={lrClassName} onClick={() => this.onPressResult(3)}>
						{this.renderSub(GAME_FIELD_ITPT_LR)}
					</div>
				</div>
			</div>
			<div className="game-4f-bottom">
				<span>{gamestats}</span>
			</div>
		</div>;
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureFourFieldsView);