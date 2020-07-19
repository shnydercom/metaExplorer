import { LDDict } from '../../../ldaccess/LDDict';
import { IKvStore } from '../../../ldaccess/ikvstore';
import { BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';
import { UserDefDict } from '../../../ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';
import { initLDLocalState, gdsfpLD, generateItptFromCompInfo } from '../../generic/generatorFns';
import { Component, ReactNode } from 'react';

export const NavSearchBarName = "metaexplorer.io/material-design/NavSearchBar";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, VisualKeysDict.searchText, VisualKeysDict.routeSend_back, VisualKeysDict.cssClassName];
let ownKVL: IKvStore[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.searchText,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.routeSend_back,
		value: undefined,
		ldType: VisualTypesDict.route_added,
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.searchText,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const NavSearchBarBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavSearchBarName,
	ownKVL: ownKVL,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavSearchBarState = LDLocalState & {
	searchValue: string;
	routeSendBack: string;
	isDoRedirect: boolean;
};

export abstract class AbstractNavSearchBar extends Component<
LDConnectedState & LDConnectedDispatch & LDOwnProps,
NavSearchBarState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: NavSearchBarState): null | NavSearchBarState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer],
			[VisualKeysDict.searchText, VisualKeysDict.routeSend_back, VisualKeysDict.cssClassName, UserDefDict.outputKVMapKey]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, };
		let searchValue = rvNew.localValues.get(VisualKeysDict.searchText);
		let routeSendBack = rvNew.localValues.get(VisualKeysDict.routeSend_back);
		return { ...rvNew, searchValue, routeSendBack, isDoRedirect: prevState.isDoRedirect };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVL: IKvStore[];

	protected renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props,
			[VisualKeysDict.inputContainer],
			[VisualKeysDict.searchText, VisualKeysDict.routeSend_back, VisualKeysDict.cssClassName, UserDefDict.outputKVMapKey]);
		this.state = {
			searchValue: ldState.localValues.get(VisualKeysDict.searchText),
			routeSendBack: ldState.localValues.get(VisualKeysDict.routeSend_back),
			isDoRedirect: false,
			...ldState
		};
	}

	onSearchChange = (evtVal) => {
		this.setState({ ...this.state, searchValue: evtVal });
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		let outSearchKv: IKvStore = {
			key: VisualKeysDict.searchText,
			value: evtVal,
			ldType: LDDict.Text
		};
		//TODO: it might be a good idea to debounce before updating the application state
		this.props.dispatchKvOutput([outSearchKv], this.props.ldTokenString, outputKVMap);
	}
	onBackBtnClick = () => {
		if (this.state.routeSendBack === undefined || this.state.routeSendBack === null) return;
		this.setState({ ...this.state, isDoRedirect: true });
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
