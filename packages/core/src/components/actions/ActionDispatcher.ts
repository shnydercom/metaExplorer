import { KVL } from "../../ldaccess/KVL";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import { AbstractDataTransformer } from "../../datatransformation/abstractDataTransformer";
import { ActionTypesDict, ActionType, ActionKeysDict } from "../../components/actions/ActionDict";
import { isObjPropertyRef } from "../../ldaccess/ldUtils";
import { getApplicationStore } from "../../approot";
import { ldAction } from "../../appstate/epicducks/ldOptions-duck";

export const ActionDispatcherName: string = "ActionDispatcher";

export const ActionDispatcherKeys: string[] = [ActionKeysDict.trigger, ActionKeysDict.action_confirm];
export const ActionDispatcherOutputKVs: KVL[] = [
];

const ownKVLs: KVL[] = [
	{
		key: ActionKeysDict.trigger,
		value: undefined,
		ldType: undefined
	},
	{
		key: ActionKeysDict.action_confirm,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
	},
	...ActionDispatcherOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ActionDispatcherName,
	ownKVLs: ownKVLs,
	inKeys: ActionDispatcherKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class ActionDispatcher extends AbstractDataTransformer {

	protected previousTrigger: KVL;

	constructor(ldTkStr?: string) {
		super(ldTkStr);
		this.itptKeys = ActionDispatcherKeys;
		this.outputKvStores = ActionDispatcherOutputKVs;
		let kvs = this.cfg.ownKVLs;
		//setting inputParams on first load, refresh output if necessary
		for (let inputidx = 0; inputidx < this.itptKeys.length; inputidx++) {
			const inputKey = this.itptKeys[inputidx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param && param.value !== null && !isObjPropertyRef(param.value)
				&& JSON.stringify(param) !== JSON.stringify(this.inputParams.get(inputKey))) {
				this.inputParams.set(inputKey, param);
			}
		}
		this.previousTrigger = this.inputParams.get(ActionKeysDict.trigger);
		//this.refreshOutput();
	}

	evalDirtyInput = () => {
		if (this.isInputDirty) {
			this.isInputDirty = false;
			const currentTrigger = this.inputParams.get(ActionKeysDict.trigger);
			if (JSON.stringify(currentTrigger) !== JSON.stringify(this.previousTrigger)) {
				this.previousTrigger = currentTrigger;
				this.isOutputDirty = true;
			}
		}
	}

	/**
	 * doesn't follow the regular DataTransformer-flow, but dispatches an ldAction instead
	 */
	protected refreshOutput(): void {
		const trigger = this.inputParams.get(ActionKeysDict.trigger);
		console.log(trigger);
		const confirmAction = this.inputParams.get(ActionKeysDict.action_confirm);
		if (!confirmAction || !confirmAction.value || (typeof confirmAction.value !== 'object')) {
			console.info('received an invalid action in KVL: ' + confirmAction);
			return;
		}
		if (Array.isArray(confirmAction.value) && confirmAction.value.length === 1) {
			confirmAction.value = confirmAction.value[0];
		}
		const actionToDispatch: ActionType = confirmAction.value;
		if (Array.isArray(actionToDispatch.payload) && actionToDispatch.payload.length === 1) {
			actionToDispatch.payload = actionToDispatch.payload[0];
		}
		getApplicationStore().dispatch(
			ldAction(actionToDispatch.ldId, actionToDispatch.ldType, actionToDispatch.payload)
		);
	}
}
