/**
 * adds the requirement for a getter and setter function for the token value.
 * This is necessary because tokens are very simple objects, but shouldn't
 * only be strings because access and modification should be controlled.
 */
export interface ILDToken{
	getTokenVal(): string;
	setTokenVal(val: string);
}
