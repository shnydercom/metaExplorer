import { LDPortModel } from "./LDPortModel";
import { AbstractPortFactory } from "storm-react-diagrams";
import { IKvStore,UserDefDict } from "@metaexplorer/core";
import { LD_PORTMODEL } from "../node-editor-consts";

export class LDPortInstanceFactory extends AbstractPortFactory<LDPortModel> {
	constructor() {
		super(LD_PORTMODEL);
	}

	getNewInstance() {
		var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.outputSelfKey,
			value: undefined,
			ldType: undefined
		};
		return new LDPortModel(true, "unknown", baseDataTypeKVStore);
	}
}
