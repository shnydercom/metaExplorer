import { Observable, from } from "rxjs";
import { IModStatus } from "appstate/modstate";

export class ModAPI {  // URL to web api IRI resource
	protected modInitFns: Map<string, () => Promise<IModStatus>> = new Map();
	protected requiredMods: Map<string, boolean> = new Map();
	getModData(id: string): Observable<IModStatus> {
		if (id == null) {
			throw new Error(("no id defined for loading Mod"));
		}
		if (!this.modInitFns.has(id)) {
			throw new Error(("no Promise found for mod with id: " + id));
		}
		let returnVal: Observable<IModStatus>;
		const modPromise = this.modInitFns.get(id);
		returnVal = from(modPromise());
		return returnVal;
	}
	addModInitFn(id: string, initFn: () => Promise<IModStatus>) {
		this.modInitFns.set(id, initFn);
	}
	addRequiredMod(modId: string) {
		this.requiredMods.set(modId, false);
	}
	setRequiredModLoadingComplete(modId: string){
		this.requiredMods.set(modId, true);
	}
	isRequiredLoadingComplete(): boolean {
		let rv = true;
		this.requiredMods.forEach((val, key) => {
			if (val === false) rv = false;
		});
		return rv;
	}
}
