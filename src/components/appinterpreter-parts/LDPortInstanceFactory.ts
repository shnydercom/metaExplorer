import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { AbstractInstanceFactory } from "storm-react-diagrams";
import { IKvStore } from "ldaccess/ikvstore";
import { UserDefDict } from "ldaccess/UserDefDict";

export class LDPortInstanceFactory extends AbstractInstanceFactory<LDPortModel> {
	constructor() {
		super("LDPortModel");
	}

	getInstance() {
		var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: undefined
		};
		return new LDPortModel(true, "unknown", baseDataTypeKVStore);
	}
}
