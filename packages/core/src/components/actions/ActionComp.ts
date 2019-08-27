import { IKvStore } from "../../ldaccess/ikvstore";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import { LDDict } from "../../ldaccess/LDDict";
import { UserDefDict } from "../../ldaccess/UserDefDict";
import { AbstractDataTransformer } from "../../datatransformation/abstractDataTransformer";
import { ActionTypesDict, ActionType } from "../../components/actions/ActionDict";
import { isObjPropertyRef } from "../../ldaccess/ldUtils";

export const payloadInputKey = UserDefDict.inputData;
const transfOutputKey = UserDefDict.outputData;
export const actionIdField = "actionId";
export const actionTypeField = "actionType";

export const ActionCompName: string = "ActionAssembler";

export const ActionCompKeys: string[] = [actionIdField, actionTypeField, payloadInputKey];
export const ActionCompOutputKVs: IKvStore[] = [
	{
		key: transfOutputKey,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
	}
];

const initialKVStores: IKvStore[] = [
	{
		key: actionIdField,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: actionTypeField,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: payloadInputKey,
		value: undefined,
		ldType: undefined
	},
	...ActionCompOutputKVs
];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ActionCompName,
	initialKvStores: initialKVStores,
	interpretableKeys: ActionCompKeys,
	crudSkills: "cRUd"
};
@ldBlueprint(bpCfg)
export class ActionComp extends AbstractDataTransformer {
	constructor(ldTkStr?: string) {
		super(ldTkStr);
		this.itptKeys = ActionCompKeys;
		this.outputKvStores = ActionCompOutputKVs;
		let kvs = this.cfg.initialKvStores;
		//setting inputParams on first load, refresh output if necessary
		for (let inputidx = 0; inputidx < this.itptKeys.length; inputidx++) {
			const inputKey = this.itptKeys[inputidx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param && param.value !== null && !isObjPropertyRef(param.value)
				&& JSON.stringify(param) !== JSON.stringify(this.inputParams.get(inputKey))) {
				this.inputParams.set(inputKey, param);
			}
		}
		this.refreshOutput();
	}

	/**
	 * this function produces an ldAction-typed value with id, type, and payload field
	 * @param inputParams
	 * @param outputKvStores
	 */
	protected mappingFunction(
		inputParams: Map<string, IKvStore>,
		outputKvStores: Map<string, IKvStore>): IKvStore[] {
		let rv = [];
		let payloadInputKv = inputParams.get(payloadInputKey);
		let idFieldKv = inputParams.get(actionIdField);
		let typeFieldKv = inputParams.get(actionTypeField);
		if (payloadInputKv && payloadInputKv.value && ((idFieldKv && idFieldKv.value) || (typeFieldKv && typeFieldKv.value))) {
			let payload: any[] = payloadInputKv.value;
			//source type constants
			const idFieldConst = idFieldKv ? idFieldKv.value : null;
			const typeFieldConst = typeFieldKv ? typeFieldKv.value : null;

			const newAction: ActionType = {
				ldId: idFieldConst,
				ldType: typeFieldConst,
				payload: payload
			};
			//output var
			let outputValArr = [newAction];
			const transfOutputKV = outputKvStores.get(transfOutputKey);
			transfOutputKV.value = outputValArr;
			rv = [transfOutputKV];
		}
		return rv;
	}
}
