import { Toolkit } from "storm-react-diagrams";
import { ITPT_LINEAR_SPLIT, ITPT_REFMAP_BASE } from "./iitpt-retriever";
/**
 * adds the requirement for a getter and setter function for the token value.
 * This is necessary because tokens are very simple objects, but shouldn't
 * only be strings because access and modification should be controlled.
 * Furthermore, a value can be different on the client than on the server,
 * or whatever resource on the network it is getting it from.
 * e.g. when the client creates a value that the server hasn't (got/created/accepted/received)
 * That's why there's a separation between the network value and the local client value
 */
export interface ILDToken {
	getNetworkVal(): string;
	setNetworkVal(val: string);
	getClientTokenVal(): string;
	setClientTokenVal(val: string);
	get(): string;
}

export function createConcatNetworkPreferredToken(inputLDTokenString: string, targetIntrprtrLnk: string): NetworkPreferredToken {
	return new NetworkPreferredToken(inputLDTokenString + "_" + targetIntrprtrLnk);
}

export function linearLDTokenStr(ldTokenStr: string, id: number): string {
	return ldTokenStr + '-' + ITPT_LINEAR_SPLIT + id;
}

export function refMapBaseTokenStr(ldTokenStr: string): string {
	return ldTokenStr + "_" + ITPT_REFMAP_BASE;
}

export class NetworkPreferredToken implements ILDToken {
	private nwVal: string = null;
	private clientVal: string = null;

	constructor(initialVal: string) {
		if (!initialVal || initialVal.length === 0)
			this.clientVal = Toolkit.UID();
		else
			this.clientVal = initialVal;
	}
	getNetworkVal(): string {
		return this.nwVal;
	}
	setNetworkVal(val: string) {
		if (!val || val.length === 0) this.nwVal = null;
		this.nwVal = val;
	}
	getClientTokenVal(): string {
		return this.clientVal;
	}
	setClientTokenVal(val: string) {
		if (!val || val.length === 0) this.clientVal = null;
		this.clientVal = val;
	}
	get(): string {
		let rv: string = null;
		if (this.clientVal && this.nwVal) return this.nwVal;
		if (!this.clientVal && !this.nwVal) return null;
		return this.clientVal ? this.clientVal : this.nwVal;
	}
}
