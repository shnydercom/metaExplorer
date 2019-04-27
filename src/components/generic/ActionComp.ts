import { IKvStore } from "ldaccess/ikvstore";
import ldBlueprint, { BlueprintConfig } from "ldaccess/ldBlueprint";
import { LDDict } from "ldaccess/LDDict";
import { UserDefDict } from "ldaccess/UserDefDict";
import { AbstractDataTransformer } from "datatransformation/abstractDataTransformer";

export const payloadInputKey = UserDefDict.inputData;
export const transfOutputKey = UserDefDict.outputData;
export const idField = "actionId";
export const typeField = "actionType";

export const ActionCompName: string = "ActionComponent";

export const ActionCompKeys: string[] = [idField, typeField, payloadInputKey];
export const ActionCompOutputKVs: IKvStore[] = [
	{
		key: transfOutputKey,
		value: undefined,
		ldType: UserDefDict.metaExplorerAction
	}
];

const initialKVStores: IKvStore[] = [
	{
		key: idField,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: typeField,
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
	constructor() {
		super();
		this.itptKeys = ActionCompKeys;
		this.outputKvStores = ActionCompOutputKVs;
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
		let idFieldKv = inputParams.get(idField);
		let typeFieldKv = inputParams.get(typeField);
		if (payloadInputKv && idFieldKv && typeFieldKv) {
			if (payloadInputKv.value && idFieldKv.value && typeFieldKv.value
				&& Array.isArray(payloadInputKv.value)) {
				let payload: any[] = payloadInputKv.value;
				//source type constants
				const idFieldConst = idFieldKv.value;
				const typeFieldConst = typeFieldKv.value;

				const newAction = {
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
		}
		return rv;
	}
}
