import { ILDToken } from './ildtoken';
import { ILDResource } from './ildresource';

/**
 * this interface is used for assigning values to itpts at runtime
 */
export interface ILDOptions {
	lang: string;
	resource: ILDResource;
	ldToken: ILDToken;
	isLoading: boolean;
	visualInfo: IVisInfo;
}

/**
 * visual details for ILDOptions, which itpt to use and which retriever to get it from
 */
export interface IVisInfo {
	interpretedBy?: string;
	retriever: string;
}
