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
import {IconMenu} from 'react-toolbox/lib/menu/';
import Navigation from 'react-toolbox/lib/navigation/Navigation.js';
import { generateIntrprtrForProp } from '../../generic/generatorFns';

type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/

let cfgIntrprtKeys: string[] =
	[VisualDict.headerTxt, VisualDict.routeSend_search, VisualDict.popOverContent];
let initialKVStores: IKvStore[] = [
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
	nameSelf: "shnyder/NavBarWActions",
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureNavBarWActions extends React.Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
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
		let searchRoute = this.routeSendSearch;
	}
	render() {
		const { ldOptions } = this.props;
		return <AppBar title={this.headerText ? this.headerText : "Menu"}>
      <Navigation type='horizontal'>
				<IconButton icon='search' onClick={this.onAppBarSearchBtnClick}/>
				<IconMenu icon='account_circle' position='topRight' menuRipple onClick={this.onAppBarRightIconMenuClick}>
					{this.usrIconPopOverContent}
				</IconMenu>
			</Navigation>
		</AppBar>;
	}
	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.headerText = getKVValue(getKVStoreByKey(kvs, VisualDict.headerTxt));
			this.routeSendSearch = getKVValue(getKVStoreByKey(kvs, VisualDict.routeSend_search));
			this.usrIconPopOverContent = generateIntrprtrForProp(kvs, VisualDict.popOverContent);
		}
	}
}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureNavBarWActions);
