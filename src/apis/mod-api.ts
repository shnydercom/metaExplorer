import { Observable, from } from "rxjs";
import { IModStatus } from "appstate/modstate";

export class ModAPI {  // URL to web api IRI resource
	protected modInitFns: Map<string, () => () => Promise<IModStatus>> = new Map();
	getModData(id: string): Observable<IModStatus> {
		if (id == null) {
			throw new Error(("no id defined for loading Mod"));
		}
		if (!this.modInitFns.has(id)) {
			throw new Error(("no Promise found for mod with id: " + id));
		}
		let returnVal: Observable<IModStatus>;
		const modPromise = this.modInitFns.get(id);
		returnVal = from(modPromise()());
		return returnVal;
	}
	addModInitFn(id: string, initFn: () => () => Promise<IModStatus>) {
		this.modInitFns.set(id, initFn);
	}
}
