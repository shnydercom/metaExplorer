import { IKvStore } from "ldaccess/ikvstore";
import { LDOwnProps, LDRouteProps } from "appstate/LDProps";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { appItptMatcherFn } from "appconfig/appInterpreterMatcher";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { Component } from "react";
import { isReactComponent } from "../reactUtils/reactUtilFns";

type LDComponent = new () => Component<LDOwnProps>;
const ReactWrapLDComp = Component as LDComponent;

/*export function generateIntrprtrForProp(kvStores: IKvStore[], prop: string, retriever: string): any {//JSX.Element {
	let genKv = kvStores.find((elem) => elem.key === prop);
	if (!genKv) return null;
	//if (appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(linearLDTokenStr(ldTokenString, idx));)
	if (!isObjPropertyRef(genKv.value)) return null;
	const valAsObjPropRef: ObjectPropertyRef = genKv.value as ObjectPropertyRef;
	let NewComp: any = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(valAsObjPropRef.objRef) as LDComponent;
	return <NewComp key={0} ldTokenString={genKv.value} outputKVMap={null} />;*/
/*let test = <NewComp key={0} ldTokenString={genKv.value} outputKVMap={null} />;
let test2 = <><NewComp key={0} ldTokenString={genKv.value} outputKVMap={null} /></>;
return (<><NewComp key={0} ldTokenString={genKv.value} outputKVMap={null} /></>);*/
//}

export function generateIntrprtrForProp(kvStores: IKvStore[], prop: string, retriever: string, routes: LDRouteProps): any {//JSX.Element {
	let genKv = kvStores.find((elem) => elem.key === prop);
	if (!genKv) return null;
	if (!isObjPropertyRef(genKv.value)) return null;
	const valAsObjPropRef: ObjectPropertyRef = genKv.value as ObjectPropertyRef;
	let baseRMTkStr = valAsObjPropRef.objRef;
	let BaseComp = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(baseRMTkStr);
	if (BaseComp === null || BaseComp === undefined) {
		console.error("InterpreterReferenceMapType-component: interpreter null or undefined");
		return null;
	}
	if (isReactComponent(BaseComp)) {
		console.log("baseToken: " + baseRMTkStr);
		return <BaseComp routes={routes} ldTokenString={baseRMTkStr}/>;
	} else { return null; }
}
