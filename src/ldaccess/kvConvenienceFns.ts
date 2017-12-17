import { IKvStore } from "ldaccess/ikvstore";

export function getKVStoreByKey(input: IKvStore[], searchKey: string): IKvStore {
	let rv: IKvStore = null;
	if (input && input.length > 0) {
		for (let i = 0; i < input.length; i++) {
			const elem = input[i];
			if (elem.key === searchKey) rv = elem; break;
		}
	}
	return rv;
}
