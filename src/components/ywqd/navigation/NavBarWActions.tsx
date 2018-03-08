import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from 'ldaccess/ldBlueprint';
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
import { generateIntrprtrForProp } from '../../generic/generatorFns';
import { Redirect } from 'react-router';
import { GenericContainer } from '../../generic/genericContainer-component';

type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/
export const NavBarWActionsName = "ywqd/NavBarWActions";
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
	subInterpreterOf: null,
	nameSelf: NavBarWActionsName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type NavBarWActionState = {
	isDoRedirect: boolean;
	isRightMenuOpen: boolean;
};
@ldBlueprint(bpCfg)
export class PureNavBarWActions extends React.Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, NavBarWActionState>
	implements IBlueprintInterpreter {
	state = {
		isDoRedirect: false,
		isRightMenuOpen: false
	};
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	lowerFreeContainer: any = null;
	headerText: string;
	routeSendSearch: string;
	usrIconPopOverContent: any;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		if (props) this.handleKVs(props);
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	onAppBarRightIconMenuClick = (e) => {
		//will be called on opening and clicking inside the menu
		let target = this.usrIconPopOverContent;
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
						{this.usrIconPopOverContent}
					</IconMenu>
				</Navigation>
			</AppBar>
			{this.lowerFreeContainer}
			</>;
	}
	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.lowerFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer);
			this.headerText = getKVValue(getKVStoreByKey(kvs, VisualDict.headerTxt));
			this.routeSendSearch = getKVValue(getKVStoreByKey(kvs, VisualDict.routeSend_search));
			this.usrIconPopOverContent = this.usrIconPopOverContent ? generateIntrprtrForProp(kvs, VisualDict.popOverContent) : null;
		}
		if (!this.lowerFreeContainer) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.lowerFreeContainer = generateIntrprtrForProp(kvs, VisualDict.freeContainer);
		}
		if (!this.usrIconPopOverContent) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.usrIconPopOverContent = generateIntrprtrForProp(kvs, VisualDict.popOverContent);
		}
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarWActions);
