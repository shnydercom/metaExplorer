import { AbstractDataTransformer } from "datatransformation/abstractDataTransformer";
import { UserDefDict } from "ldaccess/UserDefDict";
import { ActionKeysDict } from "./ActionDict";
import { IKvStore } from "ldaccess/ikvstore";
import { LDDict } from "ldaccess/LDDict";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { applicationStore } from "approot";
import { registerIdActionHandlerAction, registerTypeActionHandlerAction } from "appstate/epicducks/action-duck";

export const handleTypeKey = ActionKeysDict.canHandleType;
export const handleIdKey = ActionKeysDict.canHandleId;
export const payloadOutputKey = UserDefDict.outputData;

export const ActionHandlerName = "ActionHandler";

export const ActionHandlerKeys: string[] = [handleTypeKey, handleIdKey];
export const ActionHandlerOutputKVs: IKvStore[] = [
	{
		key: payloadOutputKey,
		value: undefined,
		ldType: undefined
	}
];
export const ActionHandlerInputKVs: IKvStore[] = [
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

const initialKVStores: IKvStore[] = [
	...ActionHandlerOutputKVs,
	...ActionHandlerInputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ActionHandlerName,
	initialKvStores: initialKVStores,
	interpretableKeys: ActionHandlerKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class ActionHandler extends AbstractDataTransformer {
	constructor(ldTkStr?: string) {
		super(ldTkStr);
		this.itptKeys = ActionHandlerKeys;
		this.outputKvStores = ActionHandlerOutputKVs;
		let typeKv = this.cfg.initialKvStores.find((val) => val.key === handleTypeKey);
		let idKv = this.cfg.initialKvStores.find((val) => val.key === handleIdKey);
		this.triggerRegisterIfNecessary(typeKv, idKv);
	}

	protected triggerRegisterIfNecessary(typeKv: IKvStore, idKv: IKvStore) {
		if (idKv && !!idKv.value) {
			applicationStore.dispatch(registerIdActionHandlerAction(idKv.value, this.ldTkStr));
		}
		if (typeKv && !!typeKv.value) {
			applicationStore.dispatch(registerTypeActionHandlerAction(typeKv.value, this.ldTkStr));
		}
	}

	protected mappingFunction(
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];
		let handleTypeInputKv = inputParams.get(handleTypeKey);
		let handleIdInputKv = inputParams.get(handleIdKey);
		let internalActionKv = inputParams.get(ActionKeysDict.action_internal);
		if (handleTypeInputKv && handleIdInputKv && internalActionKv) {
			if (handleTypeInputKv.value && handleIdInputKv.value && internalActionKv.value) {
				const payload = internalActionKv.value;
				const transfOutputKV = outputKvStores.get(payloadOutputKey);
				transfOutputKV.value = payload;
				rv = [transfOutputKV];
			}
		}
		return rv;
	}
}
