import { connect } from 'react-redux';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualKeysDict, VisualTypesDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import { initLDLocalState, gdsfpLD, generateItptFromCompInfo } from '../../generic/generatorFns';
import { Component, ComponentClass, StatelessComponent } from 'react';

import { Input, InputTheme } from 'react-toolbox/lib/input';
import { Redirect } from 'react-router';
import { cleanRouteString } from '../../routing/route-helper-fns';
import { classNamesLD } from 'components/reactUtils/compUtilFns';

export const NavSearchBarName = "shnyder/md/NavSearchBar";
let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, VisualKeysDict.searchText, VisualKeysDict.routeSend_back, VisualKeysDict.cssClassName];
let initialKVStores: IKvStore[] = [
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
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavSearchBarName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export interface NavSearchBarState extends LDLocalState {
	searchValue: string;
	routeSendBack: string;
	isDoRedirect: boolean;
}
@ldBlueprint(bpCfg)
export class PureNavSearchBar extends Component<
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
	initialKvStores: IKvStore[];

	private renderInputContainer = generateItptFromCompInfo.bind(this, VisualKeysDict.inputContainer);

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
	render() {
		const { searchValue, isDoRedirect, routeSendBack, localValues } = this.state;
		if (isDoRedirect) {
			let route: string = cleanRouteString(routeSendBack, this.props.routes);
			this.setState({ ...this.state, isDoRedirect: false });
			return <Redirect to={route} />;
		}
		return (
			<>
				<AppBar
					className={classNamesLD(null, localValues)}
				leftIcon='arrow_back' onLeftIconClick={() => this.onBackBtnClick()} rightIcon='search'>
					<Input type='text'
						className='searchbar-input'
						label=""
						name="searchInput"
						value={searchValue}
						onChange={(evt) => this.onSearchChange(evt)} />
				</AppBar>
				{this.renderInputContainer()}
			</>);
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavSearchBar);
