import { LDPortModel } from "./LDPortModel";
import { AbstractPortFactory } from "storm-react-diagrams";
import { IKvStore } from "ldaccess/ikvstore";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LD_PORTMODEL } from "./editor-consts";

export class LDPortInstanceFactory extends AbstractPortFactory<LDPortModel> {
	constructor() {
		super(LD_PORTMODEL);
	}

	getNewInstance() {
		var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: undefined
		};
		return new LDPortModel(true, "unknown", baseDataTypeKVStore);
	}
}
