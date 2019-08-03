import { LDOwnProps, LDLocalState, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "appstate/LDProps";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ldBlueprint, BlueprintConfig, OutputKVMap, IBlueprintItpt } from "ldaccess/ldBlueprint";
import { Component } from "react";
import { ILDOptions } from "ldaccess/ildoptions";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { IReactCompInfoItm } from "../reactUtils/iReactCompInfo";
import { ldOptionsDeepCopy, isObjPropertyRef } from "ldaccess/ldUtils";
import { isRouteSame } from "../reactUtils/compUtilFns";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { linearLDTokenStr } from "ldaccess/ildtoken";
import { isReactComponent } from "../reactUtils/reactUtilFns";
import { LDError } from "appstate/LDError";
import { ErrorBoundaryState } from "../errors/ErrorBoundaryState";
import React from "react";
export interface BaseContOwnProps extends LDOwnProps {
}

export interface BaseContOwnState extends LDLocalState, ErrorBoundaryState {
	errorMsg: string;
	nameSelf: string;
	routes: LDRouteProps | null;
	interpretableKeys: (string | ObjectPropertyRef)[];
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
export class PureBaseContainerRewrite extends Component<BaseContOwnProps & LDConnectedState & LDConnectedDispatch, BaseContOwnState>
{

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & BaseContOwnProps,
		prevState: null | BaseContOwnState): null | BaseContOwnState {
		if (!nextProps.ldOptions || !nextProps.ldOptions.resource ||
			nextProps.ldOptions.resource.kvStores.length === 0) return null;
		const ldOptions = nextProps.ldOptions;
		if (ldOptions.isLoading) return null;
		let interpretableKeys = prevState.interpretableKeys;
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		let newreactCompInfos: Map<string, IReactCompInfoItm> = new Map();
		let newLDTypes: Map<string, string> = new Map();
		let isLDTypeSame = true;
		let isItptKey = false;
		ldOptions.resource.kvStores.forEach((itm, idx, kvstores) => {
			let prevStateLDType = prevState.localLDTypes.get(itm.key);
			newLDTypes.set(itm.key, itm.ldType);
			if (interpretableKeys.length > 0 && interpretableKeys.findIndex((itptKey) => itptKey === itm.key) >= 0) {
				isItptKey = true;
				return;
			}
			if (!isLDTypeSame) return;
			if (prevStateLDType !== itm.ldType) {
				isLDTypeSame = false;
			}
		});
		if ((!interpretedBy
			|| !isRouteSame(nextProps.routes, prevState.routes)
			|| !isLDTypeSame)
			&& !isItptKey) {
			//i.e. first time this ldOptions-Object gets interpreted, or itpt-change
			let newldOptions = ldOptionsDeepCopy(ldOptions);
			newldOptions.visualInfo.interpretedBy = prevState.nameSelf;
			nextProps.notifyLDOptionsLinearSplitChange(newldOptions);
			let routes: LDRouteProps = nextProps.routes;
			return { ...prevState, routes, localLDTypes: newLDTypes };
		}
		ldOptions.resource.kvStores.forEach((elem, idx) => {
			let elemKey: string = elem.key;
			if (elemKey === UserDefDict.outputKVMapKey) {
				return;
			}
			let itpt: React.ComponentClass<LDOwnProps> & IBlueprintItpt = null;
			if (elem.ldType === UserDefDict.intrprtrClassType && elem.value && isObjPropertyRef(elem.value)) {
				itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt((elem.value as ObjectPropertyRef).objRef);
			} else {
				itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(linearLDTokenStr(ldTokenString, idx));
			}
			let newKey: string = elem.key; // "_" + idx;
			if (isReactComponent(itpt)) {
				let ldTokenStringNew: string = linearLDTokenStr(ldTokenString, idx);
				if (isItptKey && isObjPropertyRef(elem.value)) {
					ldTokenStringNew = (elem.value as ObjectPropertyRef).objRef;
				}
				newreactCompInfos.set(newKey, { compClass: itpt, key: newKey, ldTokenString: ldTokenStringNew });
				newLDTypes.set(newKey, itpt.cfg.canInterpretType);
			} else {
				throw new LDError("baseContainer got a non-visual component");
			}
		});
		return { ...prevState, compInfos: newreactCompInfos, localLDTypes: newLDTypes };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	constructor(props?: BaseContOwnProps & LDConnectedState & LDConnectedDispatch) {
		super(props);
		this.cfg = this.constructor["cfg"];
		this.state = {
			hasError: false,
			errorMsg: '',
			nameSelf: this.cfg.nameSelf,
			routes: null,
			compInfos: new Map(),
			localLDTypes: new Map(),
			localValues: new Map(),
			interpretableKeys: this.cfg.interpretableKeys
		};
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
					reactComps[iterator] = <GenericComp key={cInfoItm.key} routes={routes} ldTokenString={cInfoItm.ldTokenString} />;
					iterator++;
				}
			});
			return <>
				{reactComps ? reactComps : null}
			</>;
		} else {
			return <span>error caught in baseContainer: {errorMsg}</span>;
		}
	}

}

export const BaseContainerRewrite = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureBaseContainerRewrite);
