import { IKvStore } from "ldaccess/ikvstore";
import { IItptRetriever } from "./iinterpreter-retriever";
import { ILDOptions } from "./ildoptions";

/**
 * matches requests for interpreters with existing interpreters. They can be stored in different
 * Interpreter-Retrievers, which are accessed by their id/name
 */
export interface IItptMatcher {
	/*
	 * matches prefilled Key-Value-Stores with an interpreter
	 **/
	getItptRetriever(itptRetrieverId: string): IItptRetriever;
	/**
	 * 
	 * @param itptRetrieverId the id/name of the retriever
	 * @param retriever the retriever to be set
	 */
	setItptRetriever(itptRetrieverId: string, retriever: IItptRetriever): void;
	matchLDOptions(matchInput: ILDOptions, crudSkills: string, itptRetrieverId: string): ILDOptions[];
}
