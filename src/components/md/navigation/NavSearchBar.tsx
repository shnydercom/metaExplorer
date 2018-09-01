import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue, ldOptionsDeepCopy } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import IconButton from 'react-toolbox/lib/button/';
import { IconMenu } from 'react-toolbox/lib/menu/';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateIntrprtrForProp } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';

import { Input, InputTheme } from 'react-toolbox/lib/input';

type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/
export const NavSearchBarName = "shnyder/md/NavSearchBar";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, VisualDict.searchText, VisualDict.routeSend_back];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.searchText,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.routeSend_back,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: VisualDict.searchText,
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
export type NavSearchBartate = {
	searchValue: string;
	routeSendBack: IKvStore;
	isDoRedirect: boolean;
};
@ldBlueprint(bpCfg)
export class PureNavSearchBar extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavSearchBartate>
	implements IBlueprintItpt {
	state = {
		searchValue: "",
		routeSendBack: null,
		isDoRedirect: false
	};
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	lowerFreeContainer: any = null;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		console.log("navSearchBar Contstructor called");
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
	}

	componentWillMount() {
		if (this.props.ldOptions) {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				this.handleKVs(this.props);
			}
		}
	}

	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	onSearchChange = (evtVal) => {

		let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
		let modSingleKV: IKvStore = getKVStoreByKey(newLDOptionsObj.resource.kvStores, VisualDict.searchText);
		modSingleKV.value = evtVal;
		this.setState({ searchValue: evtVal });
		//TODO: it might be a good idea to debounce before updating the application state
		this.props.dispatchKvOutput([modSingleKV], this.props.ldTokenString, this.outputKVMap);
	}
	onBackBtnClick = () => {
		//TODO: execute back routing, use VisualDict.routeSend_back
	}
	//<Navigation type='horizontal'>
	//</Navigation>
	render() {
		const { ldOptions, routes } = this.props;
		const { searchValue, isDoRedirect } = this.state;
		//const { routeSend_back } = localValues.get(VisualDict.routeSend_back);
		return (
			<>
				<AppBar leftIcon='arrow_back' onLeftIconClick={() => this.onBackBtnClick()} rightIcon='search'>
					<Input type='text'
						className='searchbar-input'
						label=""
						name="searchInput"
						value={searchValue}
						onChange={(evt) => this.onSearchChange(evt)} />
				</AppBar>
				{this.lowerFreeContainer}
			</>);
	}
	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		let retriever = props.ldOptions.visualInfo.retriever;
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.lowerFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
		if (props && props.ldOptions) {
			const pLdOpts: ILDOptions = props.ldOptions;
			let searchText = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, VisualDict.searchText));
			let routeSendBack = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, VisualDict.routeSend_back));
			this.outputKVMap = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, UserDefDict.outputKVMapKey));
			this.setState({ searchValue: searchText, routeSendBack });
		}
		if (!this.lowerFreeContainer) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.lowerFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavSearchBar);
