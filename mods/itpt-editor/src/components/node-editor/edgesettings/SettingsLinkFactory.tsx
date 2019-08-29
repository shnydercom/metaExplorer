import { DefaultLinkFactory, DefaultLinkModel } from "@projectstorm/react-diagrams";

export class SettingsLinkFactory extends DefaultLinkFactory {
	getNewInstance(initialConfig?: any): DefaultLinkModel {
		const newInstance = super.getNewInstance(initialConfig);
		newInstance.addLabel("");
		return newInstance;
	}
}
