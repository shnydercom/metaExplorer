import { IBlueprintItpt, BlueprintConfig, OutputKVMap } from "../ldaccess/ldBlueprint";
import { KVL } from "../ldaccess/KVL";
import { ILDOptions } from "../ldaccess/ildoptions";
import { UserDefDict } from "../ldaccess/UserDefDict";
import { isObjPropertyRef, isOutputKVSame } from "../ldaccess/ldUtils";
import { getApplicationStore } from "../approot";
import { dispatchKvUpdateAction } from "../appstate/epicducks/ldOptions-duck";
import { LDError } from "../appstate/LDError";

export const AbstractDataTransformerItptKeys = [];
export const AbstractDataTransformerOutputKVs: KVL[] = [];

/**
 * abstract class to implement a data flow. Should simplify the setup to
 * the following steps:
 * a) set input Itpt-Keys in the constructor
 * b) set an Array of your output-KVLs in the constructor
 * c) override this.mappingFunction(...)
 */
export abstract class AbstractDataTransformer implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	ownKVLs: KVL[];

	inputParams: Map<string, KVL> = new Map();
	itptKeys: string[];
	outputKvStores: KVL[];
	isInputDirty: boolean = false;
	isOutputDirty: boolean = false;
	ldTkStr: string;

	constructor(ldTkStr?: string) {
		this.cfg = this.constructor["cfg"];
		this.ldTkStr = ldTkStr;
		this.itptKeys = AbstractDataTransformerItptKeys;
		this.outputKvStores = AbstractDataTransformerOutputKVs;
		const outputKVMap = this.cfg.ownKVLs.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : null);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		this.ldTkStr = ldOptions.ldToken.get();
		let kvs = ldOptions.resource.kvStores;
		let outputKVMap: KVL = kvs.find((val) => UserDefDict.outputKVMapKey === val.key);
		outputKVMap = outputKVMap ? outputKVMap : this.cfg.ownKVLs.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		for (let inputidx = 0; inputidx < this.itptKeys.length; inputidx++) {
			const inputKey = this.itptKeys[inputidx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param && param.value !== null && !isObjPropertyRef(param.value)
				&& JSON.stringify(param) !== JSON.stringify(this.inputParams.get(inputKey))) {
				this.inputParams.set(inputKey, param);
				this.isInputDirty = true;
			}
		}
		this.evalDirtyInput();
		this.evalDirtyOutput();
	}
	setOutputKVMap = (value: OutputKVMap) => {
		if (!isOutputKVSame(value, this.outputKVMap)) this.isOutputDirty = true;
		this.outputKVMap = value;
	}
	evalDirtyOutput = () => {
		if (this.isInputDirty) return;
		if (this.isOutputDirty && this.outputKVMap) {
			this.isOutputDirty = false;
			this.refreshOutput();
		}
	}
	evalDirtyInput = () => {
		if (this.isInputDirty) {
			this.isInputDirty = false;
			this.isOutputDirty = true;
		}
	}
	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];
		return rv;
	}

	protected refreshOutput(): void {
		let newOutputKvStores: Map<string, KVL> = new Map();
		this.outputKvStores.
			forEach((kvStore) => {
				newOutputKvStores.set(kvStore.key, { key: kvStore.key, value: kvStore.value, ldType: kvStore.ldType });
			});
		const changedKvStores: KVL[] = this.mappingFunction(this.inputParams,
			newOutputKvStores);
		const thisLdTkStr: string = this.ldTkStr;
		if (!thisLdTkStr) {
			throw new LDError("ldTkStr hasn't been set, can't refresh output");
		} else {
			const updatedKvMap: OutputKVMap = this.outputKVMap;
			getApplicationStore().dispatch(dispatchKvUpdateAction(changedKvStores, thisLdTkStr, updatedKvMap));
		}
	}

}
