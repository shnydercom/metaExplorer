import { LDPortModel } from "./LDPortModel";
import { IKvStore, UserDefDict } from "@metaexplorer/core";
import { LD_PORTMODEL } from "../node-editor-consts";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";

export class LDPortInstanceFactory extends AbstractModelFactory<LDPortModel, DiagramEngine> {
	constructor() {
		super(LD_PORTMODEL);
	}

	getNewInstance() {
		var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.outputSelfKey,
			value: undefined,
			ldType: undefined
		};
		return new LDPortModel({
			in: true,
			name: "unknown",
			kv: baseDataTypeKVStore
		});
	}

	generateModel(event): LDPortModel {
		return this.getNewInstance();
	}
}
