import { ldBlueprint, BlueprintConfig, IBlueprintItpt } from "../../ldaccess/ldBlueprint";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { KVL } from "../../ldaccess/KVL";
import { ILDOptions } from "../../ldaccess/ildoptions";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps, LDLocalState } from "../../appstate/LDProps";
import { isReactComponent } from "../../components/reactUtils/reactUtilFns";
import { isRouteSame } from "../../components/reactUtils/compUtilFns";
import { refMapBaseTokenStr } from "../../ldaccess/ildtoken";
import { ldOptionsDeepCopy } from "../../ldaccess/ldUtils";
import { Component } from "react";
import { appItptMatcherFn } from "../../appconfig/appItptMatcher";
import { ErrorBoundaryState } from "../errors/ErrorBoundaryState";
import { IReactCompInfoItm } from "../reactUtils/iReactCompInfo";
import React from "react";

export type OwnProps = LDOwnProps & {
};

export interface RefMapItptState extends LDLocalState, ErrorBoundaryState {
	errorMsg: string;
	routes: LDRouteProps | null;
	cfg: BlueprintConfig;
}

let canInterpretType: string = UserDefDict.intrprtrBPCfgRefMapType;
let cfgIntrprtKeys: string[] =
	[];
let ownKVLs: KVL[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: canInterpretType,
	nameSelf: UserDefDict.intrprtrBPCfgRefMapName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureRefMapItpt extends Component
<LDConnectedState & LDConnectedDispatch & OwnProps,
RefMapItptState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & OwnProps,
		prevState: RefMapItptState): null | RefMapItptState {
		if (!nextProps.ldOptions || !nextProps.ldOptions.resource ||
			nextProps.ldOptions.resource.kvStores.length === 0) return null;
		const ldOptions = nextProps.ldOptions;
		if (ldOptions.isLoading) return null;
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let newreactCompInfos: Map<string, IReactCompInfoItm> = new Map();
		if (
			!isRouteSame(nextProps.routes, prevState.routes)
			||
			!nextProps.ldOptions.visualInfo.interpretedBy
		) {
			let newLDOptions: ILDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptions.visualInfo.interpretedBy = prevState.cfg.nameSelf;
			nextProps.notifyLDOptionsRefMapSplitChange(newLDOptions, prevState.cfg);
			let routes: LDRouteProps = nextProps.routes;
			return { ...prevState, routes };
		}
		let baseRMTkStr = refMapBaseTokenStr(ldTokenString);
		let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
		if (BaseComp === null || BaseComp === undefined) {
			console.error("ItptReferenceMapType-component: itpt null or undefined: " + baseRMTkStr);
			return null;
		}
		if (isReactComponent(BaseComp)) {
			newreactCompInfos.set(baseRMTkStr, { compClass: BaseComp, key: baseRMTkStr, ldTokenString: baseRMTkStr });
		} else {
			return null;
		}
		return { ...prevState, compInfos: newreactCompInfos };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, errorMsg: error };
	}

	cfg: BlueprintConfig;
	ownKVLs: KVL[];

	consumeLDOptions: (ldOptions: ILDOptions) => any;
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		this.state = {
			errorMsg: '',
			hasError: false,
			routes: null,
			compInfos: new Map(),
			localLDTypes: new Map(),
			localValues: new Map(),
			cfg: this.cfg
		};
	}

	buildIntrprtrJSX(ldOptions: ILDOptions, routes: LDRouteProps): any { //TODO: search for right type ?! React.Component<LDOwnProps>
		let { ldTokenString } = this.props;
		let { retriever } = ldOptions.visualInfo;
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
		let { hasError, errorMsg } = this.state;
		if (!hasError) {
			let { routes } = this.props;
			routes = routes ? { ...routes } : null;
			let iterator = 0;
			let reactComps = [];
			this.state.compInfos.forEach((cInfoItmOrItms, key) => {
				let cInfoAsArray = [];
				if (Array.isArray(cInfoItmOrItms)) {
					cInfoAsArray = cInfoItmOrItms;
				} else {
					cInfoAsArray = [cInfoItmOrItms];
				}
				for (let i = 0; i < cInfoAsArray.length; i++) {
					const cInfoItm = cInfoAsArray[i];
					let GenericComp = cInfoItm.compClass;
					reactComps[iterator] = <GenericComp key={cInfoItm.key} routes={routes}
						ldTokenString={cInfoItm.ldTokenString} />;
					iterator++;
				}
			});
			return <>
				{reactComps ? reactComps : null}
			</>;
		} else {
			return <span>error caught in RefMap: {errorMsg}</span>;
		}
	}
}
