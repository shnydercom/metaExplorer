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
import { getKVStoreByKey } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { VisualDict } from '../../visualcomposition/visualDict';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';
import IconButton from 'react-toolbox/lib/button/';
import { IconMenu } from 'react-toolbox/lib/menu/';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateIntrprtrForProp, generateCompInfoItm, generateItptFromCompInfo } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { ReactCompInfoMap, IReactCompInfoItm, ReactBlueprint } from '../../reactUtils/iReactCompInfo';

type ConnectedState = {
};

type ConnectedDispatch = {
};

export const NavBarWActionsName = "shnyder/md/NavBarWActions";
let cfgIntrprtKeys: string[] =
	[VisualDict.freeContainer, VisualDict.headerTxt, VisualDict.routeSend_search, VisualDict.popOverContent];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.freeContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.routeSend_search,
		value: undefined,
		ldType: VisualDict.route_added,
	},
	{
		key: VisualDict.popOverContent,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}

];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: NavBarWActionsName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarWActionState = {
	isDoRedirect: boolean;
	isRightMenuOpen: boolean;
};
@ldBlueprint(bpCfg)
export class PureNavBarWActions extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarWActionState>
	implements IBlueprintItpt, ReactBlueprint {
	state = {
		isDoRedirect: false,
		isRightMenuOpen: false
	};
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	compInfos: ReactCompInfoMap = new Map();
	headerText: string;
	routeSendSearch: string;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		if (props) this.handleKVs(props);
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	onAppBarRightIconMenuClick = (e) => {
		//will be called on opening and clicking inside the menu
	}
	onAppBarSearchBtnClick = (e) => {
		this.setState({
			isDoRedirect: true,
			isRightMenuOpen: false
		});
	}
	render() {
		const { ldOptions, routes } = this.props;
		const { isDoRedirect, isRightMenuOpen } = this.state;
		return isDoRedirect && this.routeSendSearch ? <Redirect to={this.routeSendSearch} />
			: <><AppBar title={this.headerText ? this.headerText : "Menu"}>
				<Navigation type='horizontal'>
					<IconButton icon='search' onClick={this.onAppBarSearchBtnClick} />
					<IconMenu icon='account_circle' position='topRight' menuRipple onClick={this.onAppBarRightIconMenuClick}>
						{this.renderSub(VisualDict.popOverContent)}
					</IconMenu>
				</Navigation>
			</AppBar>
			{this.renderSub(VisualDict.freeContainer)}
			</>;
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		let retriever = props.ldOptions.visualInfo.retriever;
		let lowerFreeContainerInfo: IReactCompInfoItm;
		let usrIconPopOverInfo: IReactCompInfoItm;
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			lowerFreeContainerInfo = generateCompInfoItm(kvs, VisualDict.freeContainer, retriever, this.props.routes);
			this.headerText = getKVValue(getKVStoreByKey(kvs, VisualDict.headerTxt));
			this.routeSendSearch = getKVValue(getKVStoreByKey(kvs, VisualDict.routeSend_search));
			usrIconPopOverInfo = usrIconPopOverInfo ? generateCompInfoItm(kvs, VisualDict.popOverContent, retriever, this.props.routes) : null;
		}
		if (!lowerFreeContainerInfo) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			lowerFreeContainerInfo = generateCompInfoItm(kvs, VisualDict.freeContainer, retriever, this.props.routes);
		}
		if (!usrIconPopOverInfo) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			usrIconPopOverInfo = generateCompInfoItm(kvs, VisualDict.popOverContent, retriever, this.props.routes);
		}
		if (lowerFreeContainerInfo) {
			this.compInfos.set(VisualDict.freeContainer, lowerFreeContainerInfo);
		} else {
			this.compInfos.delete(VisualDict.freeContainer);
		}
		if (usrIconPopOverInfo) {
			this.compInfos.set(VisualDict.popOverContent, usrIconPopOverInfo);
		} else {
			this.compInfos.delete(VisualDict.popOverContent);
		}
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarWActions);
