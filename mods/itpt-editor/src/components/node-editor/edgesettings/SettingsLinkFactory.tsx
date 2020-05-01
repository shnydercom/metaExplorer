import { DefaultLinkFactory, DefaultLinkModel } from "@projectstorm/react-diagrams";

export class SettingsLinkFactory extends DefaultLinkFactory {
	
	generateModel(){
		return this.getNewInstance();
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		const newInstance = super.generateModel(initialConfig);
		newInstance.addLabel("");
		return newInstance;
	}
	
}
