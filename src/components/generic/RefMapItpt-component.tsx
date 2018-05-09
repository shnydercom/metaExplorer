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
import { compNeedsUpdate } from "components/reactUtils/compUtilFns";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { ILDResource } from "ldaccess/ildresource";
import { ILDToken, NetworkPreferredToken, createConcatNetworkPreferredToken, refMapBaseTokenStr } from "ldaccess/ildtoken";
import { isObjPropertyRef, ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { LDConsts } from "ldaccess/LDConsts";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultInterpreterRetriever";
import { Component } from "react";
import { appItptMatcherFn } from "appconfig/appInterpreterMatcher";
import { ITPT_REFMAP_BASE } from "ldaccess/iinterpreter-retriever";

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
//TODO: move state-relevant ldOptionsMap-Entry generation outside of the component, or make this a non-visual interpreter
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
			this.consumeLDOptions(props.ldOptions);
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!this.props.ldOptions) return;
		if (!this.props.ldOptions.visualInfo.interpretedBy) {
			let newLDOptions: ILDOptions = ldOptionsDeepCopy(this.props.ldOptions);
			newLDOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsRefMapSplitChange(newLDOptions, this.cfg);
			return null;
		}
		this.subItpt = this.buildIntrprtrJSX(ldOptions);
	}

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			//if (nextProps.ldOptions.isLoading) return;
			this.consumeLDOptions(nextProps.ldOptions);
		}
	}

	componentWillMount() {
		console.log("componentWillmount");
		console.log(this.constructor.name);
		console.log(this.constructor["cfg"]);
	}

	buildIntrprtrJSX(ldOptions: ILDOptions): any { //TODO: search for right type ?! React.Component<LDOwnProps>
		let { ldTokenString } = this.props;
		let { interpretedBy, retriever } = ldOptions.visualInfo;
		let baseRMTkStr = refMapBaseTokenStr(ldTokenString);
		let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
		if (BaseComp === null || BaseComp === undefined) {
			console.error("InterpreterReferenceMapType-component: interpreter null or undefined");
			return null;
		}
		if (isReactComponent(BaseComp)) {
			const { routes } = this.props;
			console.log("baseToken: " + baseRMTkStr);
			//TODO: implement output-handling/change of values in sub-interpreters
			//let targetLDToken: ILDToken = new NetworkPreferredToken(this.props.ldTokenString);
			//let newOutputKvMap: OutputKVMap = { [elemKey]: { targetLDToken: targetLDToken, targetProperty: elemKey } };
			return <BaseComp routes={routes} ldTokenString={baseRMTkStr} outputKVMap={null} />;
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
