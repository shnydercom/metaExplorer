import { LDPortModel } from "./LDPortModel";
import { IKvStore, UserDefDict } from "@metaexplorer/core";
import { LD_PORTMODEL, LINK_SETTINGS_MODEL } from "../node-editor-consts";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { SettingsLinkModel } from "../edgesettings/SettingsLinkModel";

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

	createLinkModel(): SettingsLinkModel | null {
		return this.engine.getLinkFactories().getFactory(LINK_SETTINGS_MODEL).generateModel({}) as SettingsLinkModel;
	}
}
