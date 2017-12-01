import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { ILDToken } from 'ldaccess/ildtoken';
import { ILDResource } from 'ldaccess/ildresource';

export interface ILDOptions {
	lang: string;
	resource: ILDResource;
	ldToken: ILDToken;
	isLoading: boolean;
}
