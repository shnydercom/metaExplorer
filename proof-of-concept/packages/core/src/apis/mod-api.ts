import { Observable, from } from "rxjs";
import { IModStatus } from "../appstate/modstate";

export interface IModSpec {
	id: string;
	initFn: () => Promise<IModStatus>;
	dependencies: string[];
}

export class ModAPI {  // URL to web api IRI resource
	protected modInitFns: Map<string, () => Promise<IModStatus>> = new Map();
	protected loadedModsMap: Map<string, boolean> = new Map();
	protected modDependencies: Map<string, string[]> = new Map();
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
	addModInitFn(modSpec: IModSpec) {
		this.modInitFns.set(modSpec.id, modSpec.initFn);
		this.modDependencies.set(modSpec.id, modSpec.dependencies);
	}
	addRequiredMod(modId: string) {
		this.loadedModsMap.set(modId, false);
	}
	setModLoadingComplete(modId: string) {
		this.loadedModsMap.set(modId, true);
	}
	checkDependencies(modId: string): boolean {
		const deps = this.modDependencies.get(modId);
		for (let idx = 0; idx < deps.length; idx++) {
			const dep = deps[idx];
			if (this.loadedModsMap.has(dep)) {
				if (!this.loadedModsMap.get(dep)){
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	}
	getDepenciesfor(modId: string): string[] {
		return this.modDependencies.get(modId);
	}
	isRequiredLoadingComplete(): boolean {
		let rv = true;
		this.loadedModsMap.forEach((val, key) => {
			if (val === false) rv = false;
		});
		return rv;
	}
}
