import { IKvStore } from "ldaccess/ikvstore";

export interface IInterpreterMatcher {
	/*
	 * matches prefilled Key-Value-Stores with an interpreter
	 **/

	matchSingleKV(single: IKvStore, crudSkills: string): IKvStore;
	matchKvArray(multi: IKvStore[], crudSkills: string): IKvStore[];
}
