import appItptRetrFn from "appconfig/appItptRetriever";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { SingleModStateKeysDict, IModStatus } from "appstate/modstate";
import { flatDataTypeAssemblerFactory } from "components/generic/datatype-assembler";
import { IKvStore } from "ldaccess/ikvstore";
import { IVisInfo } from "ldaccess/ildoptions";
import { LDDict } from "ldaccess/LDDict";

export const MOD_DEMO_ID = "demo";
export const MOD_DEMO_NAME = "MetaExplorer Demo Mod";

export function initDemoMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		let worksheetAssemblerName = "shnyder/generaldemo/data/worksheet";
		let worksheetInputKvs: IKvStore[] = [
			{
				key: "customer",
				value: null,
				ldType: LDDict.Text
			},
			{
				key: "project",
				value: null,
				ldType: LDDict.Text
			},
			{
				key: "subproject",
				value: null,
				ldType: LDDict.Text
			},
			{
				key: "tasks",
				value: null,
				ldType: LDDict.Text
			},
			{
				key: "description",
				value: null,
				ldType: LDDict.Text
			},
			{
				key: "workstart",
				value: null,
				ldType: LDDict.DateTime
			},
			{
				key: "workend",
				value: null,
				ldType: LDDict.DateTime
			},
			{
				key: "achievements",
				value: null,
				ldType: LDDict.Text
			}
		];
		let worksheetAssemblerComp = flatDataTypeAssemblerFactory(worksheetInputKvs, worksheetAssemblerName);
		let expenseFormAssemblerName = "shnyder/generaldemo/data/expenseForm";
		let expenseFormKvs: IKvStore[] = [
			{
				key: "proof",
				value: null,
				ldType: LDDict.URL
			},
			{
				key: "billeddate",
				value: null,
				ldType: LDDict.Date
			},
			{
				key: "expenseamount",
				value: null,
				ldType: LDDict.Double
			},
			{
				key: "summary",
				value: null,
				ldType: LDDict.Text
			}
		];
		let expenseFormAssemblerComp = flatDataTypeAssemblerFactory(expenseFormKvs, expenseFormAssemblerName);
		appIntRetr.addItpt(worksheetAssemblerName, worksheetAssemblerComp, "cRud", [ITPT_TAG_ATOMIC]);
		appIntRetr.addItpt(expenseFormAssemblerName, expenseFormAssemblerComp, "cRud", [ITPT_TAG_ATOMIC]);
		resolve({ id: MOD_DEMO_ID, name: MOD_DEMO_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
	});
	return rv;
}
