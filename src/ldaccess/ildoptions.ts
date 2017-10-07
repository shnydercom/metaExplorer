import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { ILDToken } from 'ldaccess/ildtoken';

export interface ILDOptions {
	lang: string;
	resource: IWebResource;
	ldToken: ILDToken;
}
