import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { ILDToken } from 'ldaccess/ildtoken';
import { ILDResource } from 'ldaccess/ildresource';

/**
 * this interface is used for assigning values to interpreters at runtime
 */
export interface ILDOptions {
	lang: string;
	resource: ILDResource;
	ldToken: ILDToken;
	isLoading: boolean;
	visualInfo: IVisInfo;
}

/**
 * visual details for ILDOptions, which interpreter to use and which retriever to get it from
 */
export interface IVisInfo {
	interpretedBy?: string;
	retriever: string;
}
