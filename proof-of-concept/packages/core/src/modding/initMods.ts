import { ModAPI, IModSpec } from "../apis/mod-api";
import { getApplicationStore } from "../approot";
import { loadMod } from "../appstate/epicducks/mod-duck";

export function initRequiredMods(modAPI: ModAPI, requiredMods: IModSpec[]) {
	requiredMods.forEach((spec) => {
		modAPI.addRequiredMod(spec.id);
		modAPI.addModInitFn(spec);
		getApplicationStore().dispatch(loadMod(spec.id));
	});
}
