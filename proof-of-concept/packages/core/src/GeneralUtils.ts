import { VisualKeysDict } from "./components/visualcomposition/visualDict";

/**
 * checks juggling if any of the parameters is null or undefined
 * @param inputs the input parameters
 */
export const checkAllFilled = (...inputs): boolean => {
	if (!inputs) return false;
	for (let i = 0; i < inputs.length; i++) {
		const a = inputs[i];
		if (a === null || a === undefined) return false;
	}
	return true;
};

export const arrayMove = (arr, oldIdx: number, newIdx: number) => {
	while (oldIdx < 0) {
		oldIdx += arr.length;
	}
	while (newIdx < 0) {
		newIdx += arr.length;
	}
	if (newIdx >= arr.length) {
		var k = newIdx - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(newIdx, 0, arr.splice(oldIdx, 1)[0]);
	return arr; // for testing purposes
};

/**
 * use this function for cases where the error source can be resolved by a
 * technical user by changing code. Handle other errors in the frontend
 *
 * @param userMessage a human readable Message to tell a (technical) user
 * @param dynValue a dynamic value, if any
 */
export const handleTechnicalKnownIssue = (
	userMessage: string,
	dynValue?: string
) => {
	console.warn(userMessage + dynValue);
};

export interface ClassNameProp {
	className?: string;
}

/**
 *
 * @param localValues
 */
export function cssClassNamePropFromLocalValues(
	localValues: Map<string, any>
): ClassNameProp {
	const cssClassNames: string[] = localValues.get(
		VisualKeysDict.cssClassName
	);
	if (!cssClassNames || cssClassNames.length === 0) return {};
	const className = cssClassNames.join(" ");
	return { className };
}
