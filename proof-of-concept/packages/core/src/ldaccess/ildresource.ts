import { KVL } from "./KVL";

export interface ILDWebResource {
	hypermedia: {};
}

export interface ILDResource {
	kvStores: KVL[]; //this interface makes handling local linked data-objects easier, has key, value, type; basic ld-typed computing
	webInResource: ILDWebResource; //this interface is mostly read-only
	webOutResource: string; //should be used for storing JSON-(ld)-output to the server
}
