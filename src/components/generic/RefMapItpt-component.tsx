import ldBlueprint, { BlueprintConfig, IBlueprintItpt } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps, LDLocalState } from "appstate/LDProps";
import { isReactComponent } from "components/reactUtils/reactUtilFns";
import { isRouteSame } from "components/reactUtils/compUtilFns";
import { refMapBaseTokenStr } from "ldaccess/ildtoken";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { Component } from "react";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { ErrorBoundaryState } from "../errors/ErrorBoundaryState";
import { IReactCompInfoItm } from "../reactUtils/iReactCompInfo";

export type OwnProps = LDOwnProps & {
	searchCrudSkills: string;
};

export interface RefMapItptState extends LDLocalState, ErrorBoundaryState {
	errorMsg: string;
	routes: LDRouteProps | null;
	cfg: BlueprintConfig;
}

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
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		let newreactCompInfos: Map<string, IReactCompInfoItm> = new Map();
		//let newLDTypes: Map<string, string> = new Map();
		if (
			!isRouteSame(nextProps.routes, prevState.routes)
			||
			!nextProps.ldOptions.visualInfo.interpretedBy
		) {
			let newLDOptions: ILDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptions.visualInfo.interpretedBy = prevState.cfg.nameSelf;
			//console.log(prevState.cfg.canInterpretType);
			//console.dir(newLDOptions);
			//console.dir(prevState.cfg);
			nextProps.notifyLDOptionsRefMapSplitChange(newLDOptions, prevState.cfg);
			let routes: LDRouteProps = nextProps.routes;
			return { ...prevState, routes };
		}
		let baseRMTkStr = refMapBaseTokenStr(ldTokenString);
		let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
		if (BaseComp === null || BaseComp === undefined) {
			console.error("ItptReferenceMapType-component: itpt null or undefined");
			return null;
		}
		if (isReactComponent(BaseComp)) {
			newreactCompInfos.set(baseRMTkStr, { compClass: BaseComp, key: baseRMTkStr, ldTokenString: baseRMTkStr });
			//return <BaseComp routes={routes} ldTokenString={baseRMTkStr} />;
		} else {
			return null;
		}
		return { ...prevState, compInfos: newreactCompInfos };
	}
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];

	consumeLDOptions: (ldOptions: ILDOptions) => any;
	//subItpt: any = null;
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		/*if (props && props.ldOptions) {
			this.consumeLDOptions(props.ldOptions, props.routes);
		}*/
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
	/*
		consumeLDOptions = (ldOptions: ILDOptions, routes?: LDRouteProps) => {
			if (!this.props.ldOptions) return;
			if (!this.props.ldOptions.visualInfo.interpretedBy) {
				let newLDOptions: ILDOptions = ldOptionsDeepCopy(this.props.ldOptions);
				newLDOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
				this.props.notifyLDOptionsRefMapSplitChange(newLDOptions, this.cfg);
				return null;
			}
			//this.subItpt = this.buildIntrprtrJSX(ldOptions, routes);
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
	*/
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

	componentDidCatch(error, info) {
		this.setState({ ...this.state, hasError: true, errorMsg: info });
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
