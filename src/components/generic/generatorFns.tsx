import { IKvStore } from "ldaccess/ikvstore";
import { LDOwnProps, LDRouteProps, LDConnectedState, LDLocalState, ReactCompLDLocalState, LDLocalValues } from "appstate/LDProps";
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
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";

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

export function generateItptFromCompInfo(compName: string) {
	if (!compName) return null;
	if (!this || !this.props || !this.props.routes || !this.state.compInfos) throw new LDError('function must be bound to a IBlueprintItpt with LDOwnProps and LDLocalState before being called');
	const compInfo = this.state.compInfos.get(compName);
	if (!compInfo) return null;
	let BaseComp = compInfo.compClass;
	return <BaseComp routes={this.props.routes} ldTokenString={compInfo.ldTokenString} />;
}

export function initReactCompInfoMap(
	cfg: BlueprintConfig,
	props: LDConnectedState & LDOwnProps,
	itptKeys: string[], kvKeys: string[]): LDLocalState {
	let rvCompInfo = new Map<string, IReactCompInfoItm>();
	let newKvMap = new Map<string, any>();
	let retriever = DEFAULT_ITPT_RETRIEVER_NAME;
	if (cfg) {
		let kvs = cfg.initialKvStores;
		if (props && props.ldOptions.visualInfo.retriever) {
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
			newKvMap.set(itptKey, val);
		});
	}
	if (props) {
		let compState = LDgetDerivedStateFromProps(
			props, null, itptKeys
		);
		if (compState) {
			rvCompInfo = compState.compInfos;
		}
		let localState = getDerivedKVStateFromProps(
			props, null, kvKeys
		);
		if (localState) {
			newKvMap = localState.localValues;
		}
	}
	return {compInfos: rvCompInfo, localValues: newKvMap};
}

export function LDgetDerivedStateFromProps(
	props: LDConnectedState & LDOwnProps,
	prevState: null | ReactCompLDLocalState,
	itptKeys: string[]): null | ReactCompLDLocalState {
	let rv: null | ReactCompLDLocalState = null;
	if (props && prevState && itptKeys && itptKeys.length > 0) {
		if (props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			let kvs: IKvStore[];
			let retriever = props.ldOptions.visualInfo.retriever;
			kvs = props.ldOptions.resource.kvStores;
			let newMap: ReactCompInfoMap = new Map<string, IReactCompInfoItm>();
			itptKeys.forEach((itptKey) => {
				let compInfo = generateCompInfoItm(kvs, itptKey, retriever);
				if (!compInfo) return;
				newMap.set(itptKey, compInfo);
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
	prevState: LDLocalValues,
	kvKeys: string[]): LDLocalValues {
	if (props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores && kvKeys.length > 0) {
		let kvs: IKvStore[];
		let retriever = props.ldOptions.visualInfo.retriever;
		kvs = props.ldOptions.resource.kvStores;
		let newMap = new Map<string, any>();
		kvKeys.forEach((itptKey) => {
			let kv = getKVStoreByKey(kvs, itptKey);
			if (!kv) return;
			let val = getKVValue(kv);
			newMap.set(itptKey, val);
		});
		if (!prevState) {
			return { localValues: newMap };
		}
		if (prevState.localValues.size === newMap.size) {
			try {
				prevState.localValues.forEach((val, key) => {
					if (!newMap.has(key)) {
						throw Error();
					}
					if (newMap.get(key) !== val) {
						throw Error();
					}
				});
			} catch (error) {
				return { ...prevState, localValues: newMap };
			}
		}
		return null;
	}
}
