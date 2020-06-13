import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import { SettingsLinkModel } from "./SettingsLinkModel";
import { LINK_SETTINGS_MODEL } from "../node-editor-consts";

/**
 * factory is not used when manually dragging out from a port
 */
export class SettingsLinkFactory extends DefaultLinkFactory {
	constructor() {
		super(LINK_SETTINGS_MODEL);
	}

	generateModel() {
		return this.getNewInstance();
	}

	getNewInstance(initialConfig?: any): SettingsLinkModel {
		const newInstance = new SettingsLinkModel();
		return newInstance;
	}

}
