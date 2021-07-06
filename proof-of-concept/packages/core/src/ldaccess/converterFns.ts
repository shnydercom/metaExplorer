import { KVL } from "./KVL";

export let singleHyperMediaToKvStores = (inputHM: any): KVL[] => {
	var kvStoreArray: KVL[] = new Array<KVL>();
	for (var key in inputHM) {
		if (inputHM.hasOwnProperty(key)) {
			let value = inputHM[key];
			//TODO: here would be a possible point to add a search for possible types based on the key
			let ldType = null;
			let newKvStore: KVL = {
				key: key,
				value: value,
				ldType: ldType,
			};
			kvStoreArray.push(newKvStore);
		}
	}
	return kvStoreArray;
};
