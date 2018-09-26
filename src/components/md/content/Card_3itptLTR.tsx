import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { Component, ComponentClass, StatelessComponent } from 'react';
import Card from 'metaexplorer-react-components/lib/components/card/card';
import { getDerivedItptStateFromProps, getDerivedKVStateFromProps, generateItptFromCompInfo, initLDLocalState } from '../../generic/generatorFns';

export const CONTAINER_FRONT = "frontContainer";
export const CONTAINER_MIDDLE = "middleContainer";
export const CONTAINER_LAST = "lastContainer";
export const Card3itptLTRName = "shnyder/md/CardW3Containers";

let cfgIntrprtKeys: string[] =
	[CONTAINER_FRONT, CONTAINER_MIDDLE, CONTAINER_LAST];
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
		let rvLD = getDerivedItptStateFromProps(
			nextProps, prevState, cfgIntrprtKeys);
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

	protected renderFreeContainer = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, cfgIntrprtKeys,
			[]);
		this.state = {
			...ldState,
		};
	}
	render() {
		return <Card
			frontContent={this.renderFreeContainer(CONTAINER_FRONT)}
			middleContent={this.renderFreeContainer(CONTAINER_MIDDLE)}
			lastContent={this.renderFreeContainer(CONTAINER_LAST)}
			className={this.styleClassName}>
		</Card>;
	}
}
