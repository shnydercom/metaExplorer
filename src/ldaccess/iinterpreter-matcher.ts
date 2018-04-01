import { IKvStore } from "ldaccess/ikvstore";
import { IItptRetriever } from "./iinterpreter-retriever";
import { ILDOptions } from "./ildoptions";

export interface IItptMatcher {
	/*
	 * matches prefilled Key-Value-Stores with an interpreter
	 **/
	getItptRetriever(key: string): IItptRetriever;
	setItptRetriever(key: string, retriever: IItptRetriever): void;
	matchLDOptions(matchInput: ILDOptions, crudSkills: string, itptRetrieverId: string): ILDOptions[];
}
