import { connect } from 'react-redux';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ExplorerState } from 'appstate/store';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState, LDRouteProps } from 'appstate/LDProps';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { elementAt } from 'rxjs/operators/elementAt';
import { generateIntrprtrForProp } from 'components/generic/generatorFns';
import { getKVValue, isObjPropertyRef } from 'ldaccess/ldUtils';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultInterpreterRetriever';
import { ObjectPropertyRef } from 'ldaccess/ObjectPropertyRef';
import { appItptMatcherFn } from 'appconfig/appInterpreterMatcher';
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

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
	test: ""
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
	test: ""
});*/

export var ImgHeadSubDescIntrprtrName: string = "shnyder/ImgHeadSubDescIntrprtr";
let cfgType: string = ImgHeadSubDescIntrprtrName;
let cfgIntrprtKeys: string[] =
	[VisualDict.headerItpt, VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description, VisualDict.footerItpt];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.headerItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.subHeaderTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.footerItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ImgHeadSubDescIntrprtrName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

interface TestState {
	myState: string;
}
@ldBlueprint(bpCfg)
export class PureImgHeadSubDesc extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, {}>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	headerItpt: any;
	headerText: string;
	subHeaderText: string;
	description: string;
	footerItpt: any;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
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
	render() {
		return <div className="mdscrollbar">
			<div className="header-img-container">
				{this.headerItpt}
			</div>
			<div className="header-img-container overlay-gradient">
				<div className="header-text">
					<span>{this.headerText ? this.headerText : 'headerTextPlaceholder'}</span>
				</div>
			</div>
			<div className="imgheadsubdesc-text">
				<div>
					<h4>{this.subHeaderText ? this.subHeaderText : "subHeaderTextPlaceholder"}</h4>
				</div>
				<div>
					<i>{this.description ? this.description : 'descriptionPlaceholder'}</i>
				</div>
			</div>
			<div>
				{this.footerItpt}
			</div>
		</div>;
	}
	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		const retriever = !props.ldOptions ? DEFAULT_ITPT_RETRIEVER_NAME : this.props.ldOptions.visualInfo.retriever;
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.headerItpt = generateIntrprtrForProp(kvs, VisualDict.headerItpt, retriever, this.props.routes);
			this.footerItpt = generateIntrprtrForProp(kvs, VisualDict.footerItpt, retriever, this.props.routes);
			/*this.headerText = getKVValue(getKVStoreByKey(kvs, VisualDict.headerTxt));
			this.subHeaderText = getKVValue(getKVStoreByKey(kvs, VisualDict.subHeaderTxt));
			this.description = getKVValue(getKVStoreByKey(kvs, VisualDict.description));*/
		}
		this.headerText = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, VisualDict.headerTxt));
		this.subHeaderText = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, VisualDict.subHeaderTxt));
		this.description = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, VisualDict.description));
		if (!this.headerItpt) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.headerItpt = generateIntrprtrForProp(kvs, VisualDict.headerItpt, retriever, this.props.routes);
		}
		if (!this.footerItpt) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.footerItpt = generateIntrprtrForProp(kvs, VisualDict.footerItpt, retriever, this.props.routes);
		}
	}

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgHeadSubDesc);
