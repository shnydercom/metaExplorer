import { isLDOptionsSame } from "ldaccess/ldUtils";

export const compNeedsUpdate = (nextProps, lastProps): boolean => {
	return nextProps.ldTokenString !== lastProps.ldTokenString ||
		JSON.stringify(nextProps.outputKVMap) !== JSON.stringify(lastProps.outputKVMap) ||
		!isLDOptionsSame(nextProps.ldOptions, lastProps.ldOptions);
};
