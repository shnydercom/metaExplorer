import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "./ildoptions";
import { BlueprintConfig } from "./ldBlueprint";

export function getKVStoreByKey(input: IKvStore[], searchKey: string): IKvStore {
	let rv: IKvStore = null;
	if (input && input.length > 0) {
		for (let i = 0; i < input.length; i++) {
			const elem = input[i];
			if (elem.key === searchKey) { rv = elem; break; }
		}
	}
	return rv;
}

export function getKVStoreByKeyFromLDOptionsOrCfg(ldOptions: ILDOptions, cfg: BlueprintConfig, searchKey: string): IKvStore {
	let rv: IKvStore = null;
	let kvs = ldOptions && ldOptions.resource && ldOptions.resource.kvStores ? ldOptions.resource.kvStores : [];
	rv = kvs.find((val) => searchKey === val.key);
	rv = rv ? rv : cfg.initialKvStores.find((val) => searchKey === val.key);
	return rv;
}
