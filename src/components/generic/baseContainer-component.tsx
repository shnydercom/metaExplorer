import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

import { appItptMatcherFn } from 'appconfig/appItptMatcher';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { IHypermediaContainer } from 'hydraclient.js/src/DataModel/IHypermediaContainer';
import { singleHyperMediaToKvStores, multiHyperMediaToKvStores } from 'ldaccess/converterFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { LDConsts } from 'ldaccess/LDConsts';
import { isItpt, isLDOptionsSame, ldOptionsDeepCopy } from 'ldaccess/ldUtils';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate, isRouteSame } from 'components/reactUtils/compUtilFns';
import { ILDResource } from 'ldaccess/ildresource';
import { ILDToken, NetworkPreferredToken, linearLDTokenStr } from 'ldaccess/ildtoken';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultItptRetriever';
import { isReactComponent } from '../reactUtils/reactUtilFns';
import { LDError } from 'appstate/LDError';
import { Component, ComponentClass, StatelessComponent } from 'react';

export interface BaseContOwnProps extends LDOwnProps {
	searchCrudSkills: string;
}

export const COMP_BASE_CONTAINER = "shnyder/baseContainer";

let cfgType: string = UserDefDict.itptContainerObjType;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: COMP_BASE_CONTAINER,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureBaseContainer extends Component<LDConnectedState & LDConnectedDispatch & BaseContOwnProps, {}>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	outputKVMap: OutputKVMap;
	reactCompInfo: {
		compClass: React.ComponentClass<LDOwnProps> & IBlueprintItpt
	}[] = [];
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		if (props) {
			this.consumeLDOptions(props.ldOptions);
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		let genKvStores: IKvStore[] = [];
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		let sCSkills: string = "cRud";
		let reactCompInfoCopy = this.reactCompInfo.slice();
		let newreactCompInfo = [];
		if (ldOptions.isLoading) return;
		if (!interpretedBy || !isLDOptionsSame(this.props.ldOptions, ldOptions)) {
			//i.e. first time this ldOptions-Object gets interpreted, or itpt-change
			let newldOptions = ldOptionsDeepCopy(ldOptions);
			newldOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsLinearSplitChange(newldOptions);
			return;
		} else {
			ldOptions.resource.kvStores.forEach((elem, idx) => {
				let elemKey: string = elem.key;
				let itpt: React.ComponentClass<LDOwnProps> & IBlueprintItpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(linearLDTokenStr(ldTokenString, idx));
				if (isReactComponent(itpt)) {
					let targetLDToken: ILDToken = new NetworkPreferredToken(this.props.ldTokenString);
					newreactCompInfo.push({ compClass: itpt });
				} else {
					throw new LDError("baseContainer got a non-visual component");
				}
			});
			this.reactCompInfo = newreactCompInfo;
		}
	}

	componentWillReceiveProps(nextProps: BaseContOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (!isRouteSame(nextProps.routes, this.props.routes)) {
			//always update when route has changed
			let newldOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newldOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsLinearSplitChange(newldOptions);
		} else {
			this.consumeLDOptions(nextProps.ldOptions);
		}
		//}
	}

	componentWillMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	render() {
		let { ldTokenString, routes } = this.props;
		let reactComps = this.reactCompInfo.map((itm, idx) => {
			let GenericComp = itm.compClass;
			return <GenericComp key={idx} routes={routes} ldTokenString={
				linearLDTokenStr(ldTokenString, idx)
			} />;
		});
		return <>
			{reactComps ? reactComps : null}
		</>;
	}
}

export const BaseContainer = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureBaseContainer);
