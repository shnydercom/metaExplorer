import { isLDOptionsSame } from "ldaccess/ldUtils";
import { LDRouteProps } from "appstate/LDProps";
import { VisualKeysDict } from "components/visualcomposition/visualDict";

export const compNeedsUpdate = (nextProps, lastProps): boolean => {
	return nextProps.ldTokenString !== lastProps.ldTokenString ||
		JSON.stringify(nextProps.outputKVMap) !== JSON.stringify(lastProps.outputKVMap) ||
		!isLDOptionsSame(nextProps.ldOptions, lastProps.ldOptions) ||
		!isRouteSame(nextProps.routes, lastProps.routes);
};

export const isRouteSame = (nextRoute: LDRouteProps, lastRoute: LDRouteProps): boolean => {
	if (!nextRoute && !lastRoute) return true;
	if (!nextRoute || !lastRoute) return false;
	return nextRoute.match.path === lastRoute.match.path;
};

export const classNamesLD = (inputClassNames: string, localValues: Map<string, any>): string => {
	let rv = "";
	if (!!inputClassNames) rv = inputClassNames;
	const localCSSVal = localValues.get(VisualKeysDict.cssClassName);
	if (!!localCSSVal) {
		let classArr = [];
		if (Array.isArray(localCSSVal)) {
			classArr.concat(localCSSVal);
		}else{
			classArr.push(localCSSVal);
		}
		classArr.push(rv);
		rv = classArr.join(" ");
	}
	return rv;
};
