import { IKvStore } from "ldaccess/ikvstore";
import { LDConsts } from 'ldaccess/LDConsts';
import { IHypermediaContainer } from "hydraclient.js/src/DataModel/IHypermediaContainer";
import { LDDict } from "ldaccess/LDDict";

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

export let multiHyperMediaToKvStores = (inputHMs: IHypermediaContainer): IKvStore[] => {
	let kvStoreArray: IKvStore[] = new Array<IKvStore>();
	console.log(inputHMs);
	return kvStoreArray;
};
