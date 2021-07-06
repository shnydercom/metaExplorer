import { AbstractDataTransformer } from "../../datatransformation/abstractDataTransformer";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { ActionKeysDict } from "./ActionDict";
import { KVL } from "../../ldaccess/KVL";
import { LDDict } from "../../ldaccess/LDDict";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import { getApplicationStore } from "../../approot";
import { registerIdActionHandlerAction, registerTypeActionHandlerAction } from "../../appstate/epicducks/action-duck";

export const handleTypeKey = ActionKeysDict.canHandleType;
export const handleIdKey = ActionKeysDict.canHandleId;
export const payloadOutputKey = UserDefDict.outputData;

export const ActionHandlerName = "ActionHandler";

export const ActionHandlerKeys: string[] = [handleTypeKey, handleIdKey];
export const ActionHandlerOutputKVs: KVL[] = [
	{
		key: payloadOutputKey,
		value: undefined,
		ldType: undefined
	}
];
export const ActionHandlerInputKVs: KVL[] = [
	{
		key: handleTypeKey,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: handleIdKey,
		value: undefined,
		ldType: LDDict.Text
	}
];

const ownKVLs: KVL[] = [
	...ActionHandlerInputKVs,
	...ActionHandlerOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ActionHandlerName,
	ownKVLs: ownKVLs,
	inKeys: ActionHandlerKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class ActionHandler extends AbstractDataTransformer {
	constructor(ldTkStr?: string) {
		super(ldTkStr);
		this.itptKeys = [ActionKeysDict.action_internal, ...ActionHandlerKeys];
		this.outputKvStores = ActionHandlerOutputKVs;
		let typeKv = this.cfg.ownKVLs.find((val) => val.key === handleTypeKey);
		let idKv = this.cfg.ownKVLs.find((val) => val.key === handleIdKey);
		this.triggerRegisterIfNecessary(typeKv, idKv);
	}

	protected triggerRegisterIfNecessary(typeKv: KVL, idKv: KVL) {
		if (idKv && !!idKv.value) {
			getApplicationStore().dispatch(registerIdActionHandlerAction(idKv.value, this.ldTkStr));
		}
		if (typeKv && !!typeKv.value) {
			getApplicationStore().dispatch(registerTypeActionHandlerAction(typeKv.value, this.ldTkStr));
		}
	}

	protected mappingFunction(
		inputParams: Map<string, KVL>,
		outputKvStores: Map<string, KVL>): KVL[] {
		let rv = [];
		let handleTypeInputKv = inputParams.get(handleTypeKey);
		let handleIdInputKv = inputParams.get(handleIdKey);
		let internalActionKv = inputParams.get(ActionKeysDict.action_internal);
		if (((handleTypeInputKv && handleTypeInputKv.value) || (handleIdInputKv && handleIdInputKv.value)) && internalActionKv && internalActionKv.value) {
			const payload = internalActionKv.value;
			const transfOutputKV = outputKvStores.get(payloadOutputKey);
			transfOutputKV.value = payload;
			rv = [transfOutputKV];
		}
		return rv;
	}
}
