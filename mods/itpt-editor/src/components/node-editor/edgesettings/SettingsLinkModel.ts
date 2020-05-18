import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { LINK_SETTINGS_MODEL } from "../node-editor-consts";

export class SettingsLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: LINK_SETTINGS_MODEL,
			color: 'rgba(180, 180, 180, 0.3)',
			selectedColor: 'rgba(87, 161, 245, 0.9)'
		});
		this.addLabel("");
	}
}
