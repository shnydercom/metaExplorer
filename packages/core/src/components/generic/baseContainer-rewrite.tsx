import { LDOwnProps, LDLocalState, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "../../appstate/LDProps";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { KVL } from "../../ldaccess/KVL";
import { ldBlueprint, BlueprintConfig, OutputKVMap, IBlueprintItpt } from "../../ldaccess/ldBlueprint";
import { Component } from "react";
import { ILDOptions } from "../../ldaccess/ildoptions";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../appstate/reduxFns";
import { IReactCompInfoItm } from "../reactUtils/iReactCompInfo";
import { ldOptionsDeepCopy, isObjPropertyRef } from "../../ldaccess/ldUtils";
import { isRouteSame } from "../reactUtils/compUtilFns";
import { ObjectPropertyRef } from "../../ldaccess/ObjectPropertyRef";
import { appItptMatcherFn } from "../../appconfig/appItptMatcher";
import { linearLDTokenStr } from "../../ldaccess/ildtoken";
import { isReactComponent } from "../reactUtils/reactUtilFns";
import { LDError } from "../../appstate/LDError";
import { ErrorBoundaryState } from "../errors/ErrorBoundaryState";
import React from "react";
export interface BaseContOwnProps extends LDOwnProps {
	errorDisplay?: React.Component<{ errorMsg: string }>;
}

export interface BaseContOwnState extends LDLocalState, ErrorBoundaryState {
	errorMsg: string;
	nameSelf: string;
	routes: LDRouteProps | null;
	inKeys: (string | ObjectPropertyRef)[];
}

export const COMP_BASE_CONTAINER = "metaexplorer.io/baseContainer";

let cfgType: string = UserDefDict.itptContainerObjType;
let cfgIntrprtKeys: string[] =
	[];
let ownKVLs: KVL[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: COMP_BASE_CONTAINER,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
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
		let inKeys = prevState.inKeys;
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		// TODO: check if it can be simplified with gdsfpLD()
		let newreactCompInfos: Map<string, IReactCompInfoItm> = new Map();
		let newLDTypes: Map<string, string> = new Map();
		let newValueMap = new Map<string, any>();
		let isLDTypeSame = true;
		let isItptKey = false;
		let hasOutputKvMap = false;
		ldOptions.resource.kvStores.forEach((itm, idx, kvstores) => {
			if (!isObjPropertyRef(itm.value)) {
				newLDTypes.set(itm.key, itm.ldType);
				newValueMap.set(itm.key, itm.value);
			}
			if (inKeys.length > 0 && inKeys.findIndex((itptKey) => itptKey === itm.key) >= 0) {
				isItptKey = true;
				return;
			}
			if (itm.key === UserDefDict.outputKVMapKey) {
				hasOutputKvMap = true;
			}
			if (!isLDTypeSame) return;
			const prevStateLDType = prevState.localLDTypes.get(itm.key);
			if (prevStateLDType !== itm.ldType) {
				if (isObjPropertyRef(itm.value)) return;
				isLDTypeSame = false;
			}
		});
		if ((!interpretedBy
			|| !isRouteSame(nextProps.routes, prevState.routes)
			|| !isLDTypeSame)
			&& !isItptKey && !(hasOutputKvMap && ldOptions.resource.kvStores.length === 1)) {
			//i.e. first time this ldOptions-Object gets interpreted, or itpt-change
			let newldOptions = ldOptionsDeepCopy(ldOptions);
			newldOptions.visualInfo.interpretedBy = prevState.nameSelf;
			nextProps.notifyLDOptionsLinearSplitChange(newldOptions);
			let routes: LDRouteProps = nextProps.routes;
			// if there's a reason to notify a state update, any old error shouldn't be displayed any more
			const hasError = false;
			const errorMsg = "";
			return { ...prevState, routes, localLDTypes: newLDTypes, localValues: newValueMap, hasError, errorMsg };
		}
		try {
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
					newValueMap.set(newKey, elem.value);
				} else {
					throw new LDError(`baseContainer got a non-visual component. It was looking for ${JSON.stringify(elem)} and got ${itpt}`);
				}
			});
		} catch (error) {
			const errorMsg = `${JSON.stringify(error)}`;
			return { ...prevState, hasError: true, errorMsg };
		}
		//compare localValues against each other and dispatch KVUpdate
		const changedValues: string[] = [];
		newValueMap.forEach((val, key) => {
			if (key !== UserDefDict.outputKVMapKey) {
				const prevHas = prevState.localValues.has(key);
				if (!prevHas || (prevHas && JSON.stringify(prevState.localValues.get(key)) !== JSON.stringify(val))) {
					changedValues.push(key);
				}
			}
		});
		if (changedValues.length > 0) {
			const outputKvs: KVL[] = changedValues.map((key) => {
				return { key, value: newValueMap.get(key), ldType: newLDTypes.get(key) };
			});
			const newKVM = (newValueMap.get(UserDefDict.outputKVMapKey) as OutputKVMap);
			if (newKVM) {
				const outputKVMap = changedValues.reduce<OutputKVMap>((prevVal, key) => {
					if (newKVM[key]) {
						prevVal[key] = newKVM[key];
					}
					return prevVal;
				}, {});
				nextProps.dispatchKvOutput(outputKvs, ldTokenString, outputKVMap);
			}
		}
		return { ...prevState, compInfos: newreactCompInfos, localValues: newValueMap, localLDTypes: newLDTypes };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

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
			inKeys: this.cfg.inKeys
		};
	}

	componentDidCatch(error, info) {
		const errorMsg = `${JSON.stringify(info)}`;
		this.setState({ ...this.state, hasError: true, errorMsg });
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
					const GenericComp = cInfoItm.compClass;
					reactComps[iterator] = <GenericComp key={cInfoItm.key} routes={routes} ldTokenString={cInfoItm.ldTokenString} />;
					iterator++;
				}
			});
			return <>
				{reactComps ? reactComps : null}
			</>;
		} else {
			if (this.props.errorDisplay) {
				const GenericErrorDispl: any = this.props.errorDisplay;
				return <GenericErrorDispl errorMsg={`${errorMsg}`} />;
			}
			return <span>error caught in baseContainer: {`${errorMsg}`}</span>;
		}
	}

}

export const BaseContainerRewrite = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureBaseContainerRewrite);
