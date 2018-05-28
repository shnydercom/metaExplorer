import { IKvStore } from "ldaccess/ikvstore";
import { IItptRetriever } from "./iitpt-retriever";
import { ILDOptions } from "./ildoptions";

/**
 * matches requests for itpts with existing itpts. They can be stored in different
 * itpt-Retrievers, which are accessed by their id/name
 */
export interface IItptMatcher {
	/*
	 * matches prefilled Key-Value-Stores with an itpt
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
