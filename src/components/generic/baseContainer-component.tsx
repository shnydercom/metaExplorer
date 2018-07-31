/*import { connect } from 'react-redux';

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
import { isItpt, isLDOptionsSame, ldOptionsDeepCopy, isObjPropertyRef } from 'ldaccess/ldUtils';
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
import { IReactCompInfoItm } from '../reactUtils/iReactCompInfo';
import { ObjectPropertyRef } from 'ldaccess/ObjectPropertyRef';
import { ErrorBoundaryState } from '../errors/ErrorBoundaryState';

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
export class PureBaseContainer extends Component<LDConnectedState & LDConnectedDispatch & BaseContOwnProps, ErrorBoundaryState>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	outputKVMap: OutputKVMap;
	reactCompInfo: IReactCompInfoItm[] = [];
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		if (props) {
			this.consumeLDOptions(props.ldOptions);
		}
		this.state = {
			hasError: false
		};
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		let genKvStores: IKvStore[] = [];
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		let sCSkills: string = "cRud";
		let reactCompInfoCopy = this.reactCompInfo.slice();
		let newreactCompInfo: IReactCompInfoItm[] = [];
		if (ldOptions.isLoading) return;
		if (!interpretedBy || !isLDOptionsSame(this.props.ldOptions, ldOptions)) {
			//i.e. first time this ldOptions-Object gets interpreted, or itpt-change
			let newldOptions = ldOptionsDeepCopy(ldOptions);
			newldOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsLinearSplitChange(newldOptions);
			return;
		} else {
			const interpretableKeys = this.cfg.interpretableKeys;
			ldOptions.resource.kvStores.forEach((elem, idx) => {
				let elemKey: string = elem.key;
				//pre-check if it exists as an interpretableKey in a pre-defined linear data display
				console.log(interpretableKeys);
				if (interpretableKeys.length > 0 && interpretableKeys.findIndex((itptKey) => itptKey === elemKey) < 0) return;
				let itpt: React.ComponentClass<LDOwnProps> & IBlueprintItpt = null;
				if (elem.ldType === UserDefDict.intrprtrClassType && elem.value && isObjPropertyRef(elem.value)) {
					itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt((elem.value as ObjectPropertyRef).objRef);
				} else {
					itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(linearLDTokenStr(ldTokenString, idx));
				}
				if (isReactComponent(itpt)) {
					newreactCompInfo.push({ compClass: itpt, key: "_" + idx, ldTokenString: linearLDTokenStr(ldTokenString, idx) });
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

	componentDidCatch(error, info) {
		console.log("basecontainer: error, info:");
		console.dir(error);
		console.dir(info);
		this.setState({ hasError: true });
	}

	render() {
		let { hasError } = this.state;
		if (!hasError) {
			let { ldTokenString, routes } = this.props;
			routes = routes ? { ...routes } : null;
			let reactComps = this.reactCompInfo.map((itm, idx) => {
				let GenericComp = itm.compClass;
				return <GenericComp key={itm.key} routes={routes} ldTokenString={itm.ldTokenString} />;
			});
			return <>
				{reactComps ? reactComps : null}
			</>;
		} else {
			return <span>error caught baseContainer</span>;
		}
	}
}

export const BaseContainer = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureBaseContainer);
*/
