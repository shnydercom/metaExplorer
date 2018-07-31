import { isLDOptionsSame } from "ldaccess/ldUtils";
import { LDRouteProps } from "appstate/LDProps";
import { last } from "../../../node_modules/rxjs/operator/last";

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
