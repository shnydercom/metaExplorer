import { IKvStore } from "ldaccess/ikvstore";
import { IWebResource } from "hydraclient.js/src/DataModel/IWebResource";

export interface ILDResource {
	kvStores: IKvStore[]; //this interface makes handling local linked data-objects easiser, has key, value, type; basic ld-typed computing
	webInResource: IWebResource; //this interface is mostly read-only
	webOutResource: string; //should be used for storing JSON-(ld)-output to the server
}
