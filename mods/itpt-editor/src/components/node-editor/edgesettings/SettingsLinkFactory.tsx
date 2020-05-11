import { DefaultLinkFactory, DefaultLinkModel } from "@projectstorm/react-diagrams";

export class SettingsLinkFactory extends DefaultLinkFactory {

	generateModel() {
		return this.getNewInstance();
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		const newInstance = new DefaultLinkModel({
			color: 'rgba(180, 180, 0, 0.3)',
			selectedColor: 'rgba(87, 161, 245, 0.9)'
		});
		newInstance.addLabel(" ");
		return newInstance;
	}

}
