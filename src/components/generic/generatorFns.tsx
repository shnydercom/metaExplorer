import { IKvStore } from "ldaccess/ikvstore";
import { LDOwnProps, LDRouteProps } from "appstate/LDProps";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { appItptMatcherFn } from "appconfig/appItptMatcher";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { Component } from "react";
import { isReactComponent } from "../reactUtils/reactUtilFns";
import { IReactCompInfoItm } from "../reactUtils/iReactCompInfo";
import { LDError } from "appstate/LDError";

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

export function generateCompInfoItm(kvStores: IKvStore[], prop: string, retriever: string, routes: LDRouteProps): IReactCompInfoItm {
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
	if (!this || !this.props || !this.props.routes || !this.compInfos) throw new LDError('function must be bound to a ReactBlueprint before being called');
	const compInfo = this.compInfos.get(compName);
	if (!compInfo) return null;
	let BaseComp = compInfo.compClass;
	return <BaseComp routes={this.props.routes} ldTokenString={compInfo.ldTokenString} />;
}
