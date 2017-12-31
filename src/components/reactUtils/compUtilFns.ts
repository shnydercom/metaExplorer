import { isLDOptionsSame } from "ldaccess/ldUtils";

export const compNeedsUpdate = (nextProps, lastProps): boolean => {
	return nextProps.ldTokenString !== lastProps.ldTokenString ||
		nextProps.outputKVMap !== lastProps.outputKVMap ||
		!isLDOptionsSame(nextProps.ldOptions, lastProps.ldOptions);
}
