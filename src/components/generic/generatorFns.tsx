import { IKvStore } from "ldaccess/ikvstore";
import { LDOwnProps, LDRouteProps, LDConnectedState, LDLocalState, ReactCompLDLocalState, LDLocalKv } from "appstate/LDProps";
import { isObjPropertyRef, getKVValue } from "ldaccess/ldUtils";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { Component } from "react";
import { isReactComponent } from "../reactUtils/reactUtilFns";
import { IReactCompInfoItm, ReactCompInfoMap } from "../reactUtils/iReactCompInfo";
import { LDError } from "appstate/LDError";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { getKVStoreByKey, getAllKVStoresByKey } from "ldaccess/kvConvenienceFns";
import { RouteComponentProps } from "react-router";

type LDComponent = new () => Component<LDOwnProps>;
const ReactWrapLDComp = Component as LDComponent;

export function generateIntrprtrForProp(kvStores: IKvStore[], prop: string, retriever: string, routes: LDRouteProps): any {//JSX.Element {
	let genKv = kvStores.find((elem) => elem.key === prop);
	if (!genKv) return null;
	if (!isObjPropertyRef(genKv.value)) return null;
	const valAsObjPropRef: ObjectPropertyRef = genKv.value as ObjectPropertyRef;
	let baseRMTkStr = valAsObjPropRef.objRef;
	let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
	if (BaseComp === null || BaseComp === undefined) {
		console.error("ItptReferenceMapType-component: itpt null or undefined");
		return null;
	}
	if (isReactComponent(BaseComp)) {
		console.log("baseToken: " + baseRMTkStr);
		return <BaseComp routes={routes} ldTokenString={baseRMTkStr} />;
	} else { return null; }
}

export function generateCompInfoItm(kvStores: IKvStore[], prop: string, retriever: string): IReactCompInfoItm {
	let rv: IReactCompInfoItm = null;
	let genKv = kvStores.find((elem) => elem.key === prop);
	if (!genKv) return null;
	if (!isObjPropertyRef(genKv.value)) return null;
	const valAsObjPropRef: ObjectPropertyRef = genKv.value as ObjectPropertyRef;
	let baseRMTkStr = valAsObjPropRef.objRef;
	let itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
	if (itpt === null || itpt === undefined) {
		console.error("ItptReferenceMapType-component: itpt null or undefined");
		return null;
	}
	if (isReactComponent(itpt)) {
		rv = {
			compClass: itpt,
			key: prop,
			ldTokenString: baseRMTkStr
		};
		return rv;
	} else { return null; }
}

export function generateAllCompInfoItms(kvStores: IKvStore[], prop: string, retriever: string): IReactCompInfoItm[] {
	let rv: IReactCompInfoItm[] = [];
	let genKvs = getAllKVStoresByKey(kvStores, prop); // kvStores.find((elem) => elem.key === prop);
	if (!genKvs || genKvs.length === 0) rv.push(null);
	for (let i = 0; i < genKvs.length; i++) {
		const genKv = genKvs[i];
		if (!isObjPropertyRef(genKv.value)) rv.push(null);
		const valAsObjPropRef: ObjectPropertyRef = genKv.value as ObjectPropertyRef;
		let baseRMTkStr = valAsObjPropRef.objRef;
		let itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
		if (itpt === null || itpt === undefined) {
			console.error("ItptReferenceMapType-component: itpt null or undefined");
			rv.push(null);
		}
		if (isReactComponent(itpt)) {
			let newComp = {
				compClass: itpt,
				key: prop,
				ldTokenString: baseRMTkStr
			};
			rv.push(newComp);
		} else { rv.push(null); }
	}
	return rv;
}

/**
 * use this function in a react component for sub-render functions that return a component
 * example usage:	private renderSub = generateItptFromCompInfo.bind(this);
 * render(){<>{this.renderSub(VisualDict.freeContainer)}<>}
 * @param compKey the key of the itpt-kv, e.g. VisualDict.freeContainer
 */
export function generateItptFromCompInfo(compKey: string, routes?: LDRouteProps, index?: number) {
	if (!compKey) return null;
	if (!this || !this.props || !this.props.routes || !this.state.compInfos) throw new LDError('function must be bound to a IBlueprintItpt with LDOwnProps and LDLocalState before being called');
	const compInfos = this.state.compInfos.get(compKey);
	let compInfo = null;
	if (Array.isArray(compInfos)) {
		let locIndex = !index ? 0 : index;
		compInfo = compInfos[locIndex];
	} else {
		compInfo = compInfos;
	}
	if (!compInfo) return null;
	let BaseComp = compInfo.compClass;
	const compRoutes = routes ? routes : this.props.routes;
	//console.log(compInfo.ldTokenString);
	//console.dir(compRoutes);
	return <BaseComp routes={compRoutes} ldTokenString={compInfo.ldTokenString} />;
}

export function initLDLocalState(
	cfg: BlueprintConfig,
	props: LDConnectedState & LDOwnProps,
	itptKeys: string[], kvKeys: string[],
	itptIsMulti?: boolean[],
	kvIsMulti?: boolean[]
): LDLocalState {
	let rvCompInfo = new Map<string, IReactCompInfoItm | IReactCompInfoItm[]>();
	let newValueMap = new Map<string, any>();
	let newLDTypeMap = new Map<string, any>();
	let retriever = DEFAULT_ITPT_RETRIEVER_NAME;
	if (cfg) {
		let kvs = cfg.initialKvStores;
		if (props && props.ldOptions && props.ldOptions.visualInfo && props.ldOptions.visualInfo.retriever) {
			retriever = props.ldOptions.visualInfo.retriever;
		}
		itptKeys.forEach((itptKey) => {
			let compInfo = generateCompInfoItm(kvs, itptKey, retriever);
			if (!compInfo) return;
			rvCompInfo.set(itptKey, compInfo);
		});
		kvKeys.forEach((itptKey) => {
			let kv = getKVStoreByKey(kvs, itptKey);
			if (!kv) return;
			let val = getKVValue(kv);
			newValueMap.set(itptKey, val);
			newLDTypeMap.set(itptKey, kv.ldType);
		});
	}
	if (props) {
		let compState = getDerivedItptStateFromProps(
			props, null, itptKeys, itptIsMulti
		);
		if (compState) {
			rvCompInfo = compState.compInfos;
		}
		let localState = getDerivedKVStateFromProps(
			props, null, kvKeys, kvIsMulti
		);
		if (localState) {
			newValueMap = localState.localValues;
		}
	}
	return { compInfos: rvCompInfo, localValues: newValueMap, localLDTypes: newLDTypeMap };
}

export function getDerivedItptStateFromProps(
	props: LDConnectedState & LDOwnProps,
	prevState: null | ReactCompLDLocalState,
	itptKeys: string[],
	isMulti?: boolean[]): null | ReactCompLDLocalState {
	let rv: null | ReactCompLDLocalState = null;
	if (props && prevState && itptKeys && itptKeys.length > 0) {
		if (props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			if (isMulti && isMulti.length !== itptKeys.length) {
				console.warn("parameter isMulti in getDerivedItptStateFromProps has been set, " +
					"but is not set for all itptKeys. Aborting function");
				return;
			}
			let kvs: IKvStore[];
			let retriever = props.ldOptions.visualInfo.retriever;
			kvs = props.ldOptions.resource.kvStores;
			let newMap: ReactCompInfoMap = new Map<string, IReactCompInfoItm | IReactCompInfoItm[]>();
			itptKeys.forEach((itptKey, idx) => {
				if (isMulti && isMulti[idx]) {
					let compInfos = generateAllCompInfoItms(kvs, itptKey, retriever);
					for (let i = 0; i < compInfos.length; i++) {
						const compInfo = compInfos[i];
						if (!newMap.has(itptKey)) {
							newMap.set(itptKey, [compInfo]);
						} else {
							(newMap.get(itptKey) as IReactCompInfoItm[]).push(compInfo);
						}
					}
				} else {
					let compInfo = generateCompInfoItm(kvs, itptKey, retriever);
					if (!compInfo) return;
					newMap.set(itptKey, compInfo);
				}
			});
			//TODO: check for compInfo-equality and return null if nothing has changed
			if (newMap.size === 0) return null;
			rv = prevState ? { ...prevState, compInfos: newMap } : { compInfos: newMap };
		}
	}
	return rv;
}

export function getDerivedKVStateFromProps(
	props: LDOwnProps & LDConnectedState,
	prevState: LDLocalKv,
	kvKeys: string[],
	isMulti?: boolean[]
): LDLocalKv {
	if (props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores && kvKeys.length > 0) {
		if (isMulti && isMulti.length !== kvKeys.length) {
			console.warn("parameter isMulti in getDerivedKVStateFromProps has been set, " +
				"but is not set for all kvKeys. Aborting function");
			return;
		}
		let kvs: IKvStore[];
		let retriever = props.ldOptions.visualInfo.retriever;
		kvs = props.ldOptions.resource.kvStores;
		let newValueMap = new Map<string, any>();
		let newLDTypeMap = new Map<string, any>();
		kvKeys.forEach((itptKey, idx) => {
			let kv = getKVStoreByKey(kvs, itptKey);
			if (!kv) return;
			let val = getKVValue(kv);
			newLDTypeMap.set(itptKey, kv.ldType);
			if (isMulti && isMulti[idx]) {
				if (!newValueMap.has(itptKey)) {
					newValueMap.set(itptKey, [val]);
				} else {
					newValueMap.get(itptKey).push(val);
				}
			} else {
				newValueMap.set(itptKey, val);
			}
		});
		if (!prevState) {
			return { localValues: newValueMap, localLDTypes: newLDTypeMap };
		}
		if (prevState.localValues.size === newValueMap.size) {
			try {
				prevState.localValues.forEach((val, key) => {
					if (!newValueMap.has(key)) {
						throw Error();
					}
					if (newValueMap.get(key) !== val) {
						throw Error();
					}
					if (newLDTypeMap.get(key) !== prevState.localLDTypes.get(key)) {
						throw Error();
					}
				});
			} catch (error) {
				return { localValues: newValueMap, localLDTypes: newLDTypeMap };
			}
		} else {
			return { localValues: newValueMap, localLDTypes: newLDTypeMap };
		}
		return null;
	}
}

/**
 * used e.g. for BaseDataTypeInput. When generic containers deconstruct the object given to them, they
 * construct interpreters based on the type of that object's properties. To display that property name
 * as a description in the interpreter, we need to determine its key. For example:
 * {myTimesheetContainerData: {workhours: 7.7, date: 2018-06-09, forProject: 'Customer Project 1'}}
 * would result in a container splitting myTimeSheetContainerData up into three interpreters,
 * workhours with a number double input field and "workhours" as the description,
 * date with a date input and "date" description, and a text field containing "Customer Project 1"
 * and "forProject" as the description
 * @param kvStores the kvStores to determine singleKVKey from
 */
export function determineSingleKVKey(kvStores: IKvStore[], cfg: BlueprintConfig): string {
	let rv: string = UserDefDict.singleKvStore;
	let candidates: IKvStore[] = [];
	if (kvStores) {
		for (let idx = 0; idx < kvStores.length; idx++) {
			const a = kvStores[idx];
			if (a.key === UserDefDict.singleKvStore) return rv;
			if (a.key === UserDefDict.outputKVMapKey) continue;
			if (kvStores[idx].ldType === cfg.canInterpretType) {
				candidates.push(kvStores[idx]);
			}
		}
	}
	if (candidates.length === 1) {
		rv = candidates[0].key as string;
	} else {
		candidates.filter((a) => cfg.interpretableKeys.includes(a.key));
		rv = candidates.length > 0 ? candidates[0].key : rv;
	}
	return rv;
}
