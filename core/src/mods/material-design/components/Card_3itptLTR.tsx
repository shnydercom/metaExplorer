import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { Component } from 'react';
import Card from 'metaexplorer-react-components/lib/components/card/card';

import { Redirect } from 'react-router';
import { ActionTypesDict } from 'components/actions/ActionDict';
import { VisualTypesDict } from 'components/visualcomposition/visualDict';
import { gdsfpLD, generateItptFromCompInfo, initLDLocalState } from 'components/generic/generatorFns';
import { cleanRouteString } from 'components/routing/route-helper-fns';

export const CONTAINER_FRONT = "frontContainer";
export const CONTAINER_MIDDLE = "middleContainer";
export const CONTAINER_LAST = "lastContainer";
export const ACTION_MIDDLE_CONTAINER = "Action_middleContainer";
export const ROUTESEND_MIDDLE_CONTAINER = "RouteSend_middleContainer";
export const Card3itptLTRName = "shnyder/material-design/CardW3Containers";

let cfgIntrprtKeys: string[] =
	[CONTAINER_FRONT, CONTAINER_MIDDLE, CONTAINER_LAST, ROUTESEND_MIDDLE_CONTAINER, ACTION_MIDDLE_CONTAINER];
let initialKVStores: IKvStore[] = [
	{
		key: CONTAINER_FRONT,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: CONTAINER_MIDDLE,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: CONTAINER_LAST,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: ROUTESEND_MIDDLE_CONTAINER,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: ACTION_MIDDLE_CONTAINER,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
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

export interface Card3itptLTRState extends LDLocalState {
	isDoRedirectFromMiddleContent: boolean;
}
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: Card3itptLTRName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
@ldBlueprint(bpCfg)
export class PureCard3itptLTR extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, Card3itptLTRState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: Card3itptLTRState): null | Card3itptLTRState {
		let rvLD = gdsfpLD(
			nextProps, prevState, cfgIntrprtKeys.slice(0, 3), cfgIntrprtKeys.slice(3));
		if (!rvLD) {
			return null;
		}
		let rvNew = {
			...prevState,
			...rvLD
		};
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string = "card-style";

	protected renderInputContainer = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, cfgIntrprtKeys.slice(0, 3),
			cfgIntrprtKeys.slice(3));
		this.state = {
			isDoRedirectFromMiddleContent: false,
			...ldState,
		};
	}

	onConfirmClick = () => {
		let middleContainerAction = this.state.localValues.get(ACTION_MIDDLE_CONTAINER);
		console.log("middleContainerAction: " + middleContainerAction);
		//TODO: execute that action
		this.setState({
			...this.state,
			isDoRedirectFromMiddleContent: true
		});
	}

	render() {
		const { isDoRedirectFromMiddleContent, localValues } = this.state;
		const routeSendFromMiddleContent = localValues.get(ROUTESEND_MIDDLE_CONTAINER);
		if (isDoRedirectFromMiddleContent && routeSendFromMiddleContent) {
			let route: string = cleanRouteString(routeSendFromMiddleContent, this.props.routes);
			this.setState({ ...this.state, isDoRedirectFromMiddleContent: false });
			console.log("Card redirect to : " + route);
			return <Redirect to={route} />;
		}
		return <Card
			frontContent={this.renderInputContainer(CONTAINER_FRONT)}
			middleContent={this.renderInputContainer(CONTAINER_MIDDLE)}
			lastContent={this.renderInputContainer(CONTAINER_LAST)}
			className={this.styleClassName}
			onMiddleContentClick={() => this.onConfirmClick()}
		>
		</Card>;
	}
}
