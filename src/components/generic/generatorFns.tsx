import * as React from 'react';
import { IKvStore } from "ldaccess/ikvstore";
import { LDOwnProps } from "appstate/LDProps";

export const generateIntrprtrForProp = (kvStores: IKvStore[], prop: string): any => {
	let genKv = kvStores.find((elem) => elem.key === prop);
	if (!genKv) return null;
	if (!genKv.intrprtrClass) return null;
	let NewComp: any = genKv.intrprtrClass;
	return <NewComp key={0} ldTokenString={genKv.value} outputKVMap={null} />;
};
