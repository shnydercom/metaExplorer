import { ModAPI, IModSpec } from "../apis/mod-api";
import { applicationStore } from "../approot";
import { loadMod } from "../appstate/epicducks/mod-duck";

export function initRequiredMods(modAPI: ModAPI, requiredMods: IModSpec[]) {
	requiredMods.forEach((spec) => {
		modAPI.addRequiredMod(spec.id);
		modAPI.addModInitFn(spec);
		applicationStore.dispatch(loadMod(spec.id));
	});
}
