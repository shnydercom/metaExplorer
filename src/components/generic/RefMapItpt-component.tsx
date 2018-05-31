import { connect } from "react-redux";
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import ImgHeadSubDescIntrprtr from "components/visualcomposition/ImgHeadSubDescIntrprtr";
import { PureImgDisplay } from "components/imagedisplay-component";
import { BaseContainer } from "components/generic/baseContainer-component";
import { isReactComponent } from "components/reactUtils/reactUtilFns";
import { compNeedsUpdate, isRouteSame } from "components/reactUtils/compUtilFns";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { ILDResource } from "ldaccess/ildresource";
import { ILDToken, NetworkPreferredToken, createConcatNetworkPreferredToken, refMapBaseTokenStr } from "ldaccess/ildtoken";
import { isObjPropertyRef, ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { LDConsts } from "ldaccess/LDConsts";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { Component } from "react";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { ITPT_REFMAP_BASE } from "ldaccess/iitpt-retriever";

export type OwnProps = LDOwnProps & {
	searchCrudSkills: string;
};

let canInterpretType: string = UserDefDict.intrprtrBPCfgRefMapType;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: canInterpretType,
	nameSelf: UserDefDict.intrprtrBPCfgRefMapName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
@ldBlueprint(bpCfg)
export class PureRefMapItpt extends Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];

	subItpt: any = null;
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		if (props && props.ldOptions) {
			this.consumeLDOptions(props.ldOptions, props.routes);
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions, routes?: LDRouteProps) => {
		if (!this.props.ldOptions) return;
		if (!this.props.ldOptions.visualInfo.interpretedBy) {
			let newLDOptions: ILDOptions = ldOptionsDeepCopy(this.props.ldOptions);
			newLDOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsRefMapSplitChange(newLDOptions, this.cfg);
			return null;
		}
		this.subItpt = this.buildIntrprtrJSX(ldOptions, routes);
	}

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		console.log("receiving refmap-props: " + nextProps.routes.location.pathname);
		if (!isRouteSame(nextProps.routes, this.props.routes)) {
			let newLDOptions: ILDOptions = ldOptionsDeepCopy(this.props.ldOptions);
			newLDOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsRefMapSplitChange(newLDOptions, this.cfg);
			return null;
		} else {
			//if (compNeedsUpdate(nextProps, this.props)) {
			//if (nextProps.ldOptions.isLoading) return;
			this.consumeLDOptions(nextProps.ldOptions, nextProps.routes);
		}
	}

	componentWillMount() {
		console.log("componentWillmount");
		console.log(this.constructor.name);
		console.log(this.constructor["cfg"]);
	}

	buildIntrprtrJSX(ldOptions: ILDOptions, routes: LDRouteProps): any { //TODO: search for right type ?! React.Component<LDOwnProps>
		let { ldTokenString } = this.props;
		let { interpretedBy, retriever } = ldOptions.visualInfo;
		let baseRMTkStr = refMapBaseTokenStr(ldTokenString);
		let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
		if (BaseComp === null || BaseComp === undefined) {
			console.error("ItptReferenceMapType-component: itpt null or undefined");
			return null;
		}
		if (isReactComponent(BaseComp)) {
			return <BaseComp routes={routes} ldTokenString={baseRMTkStr} />;
		} else {
			return null;
		}
	}

	render() {
		return <>
			{this.subItpt}
		</>;
	}
}
