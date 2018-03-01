import { nameSpaceMap } from "ldaccess/ns/nameSpaceMap";

export const resolveNS = (input: string): string => {
	if (input === null || input === undefined) return input;
	try {
		let locURI = URI(input);
		let ns = nameSpaceMap.get(locURI.origin().toString());
		let id = locURI.resource();
		if (!ns || !id) return input;
		return ns + id;
	} catch (error) {
		return input;
	}
};
