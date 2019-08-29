import { IKvStore } from "./ikvstore";

export let singleHyperMediaToKvStores = (inputHM: any): IKvStore[] => {
	var kvStoreArray: IKvStore[] = new Array<IKvStore>();
	for (var key in inputHM) {
		if (inputHM.hasOwnProperty(key)) {
			let value = inputHM[key];
			//TODO: here would be a possible point to add a search for possible types based on the key
			let ldType = null;
			let newKvStore: IKvStore = {
				key: key,
				value: value,
				ldType: ldType,
			};
			kvStoreArray.push(newKvStore);
		}
	}
	return kvStoreArray;
};
