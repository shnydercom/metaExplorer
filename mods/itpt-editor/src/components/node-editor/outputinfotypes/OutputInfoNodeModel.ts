import { OUTPUT_INFO_MODEL } from "../node-editor-consts";
import { ItptNodeModel, ItptNodeModelOptions } from "../_super/ItptNodeModel";
import { merge } from "lodash";
import { DeserializeEvent, BaseListener, BaseEvent } from "@projectstorm/react-canvas-core";
import { editorSpecificNodesColor } from "../consts";

export interface OutputInfoNodeModelListener extends BaseListener {
	outputInfoSaved?(event: BaseEvent & { itptName: null | string }): void;
}

export interface OutputInfoPartNodeModelOptions extends ItptNodeModelOptions {
	itptName: string | null;
	itptUserName: string;
	itptProjName: string;
	itptBlockName: string;
}

export const OUTPUT_NODE_WIDTH = 275;

export class OutputInfoPartNodeModel extends ItptNodeModel {

	static fromVars(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)",
			              isCompound?: boolean, type?: string, userName?: string, userProject?: string) {
		return new this({
			nameSelf,
			subItptOf,
			canInterpretType,
			color,
			type,
			isCompound,
			itptName: null,
			itptUserName: userName,
			itptProjName: userProject,
			itptBlockName: ""
		}
		);
	}
	/**
	 * itptName is the full name of any interpreter that's loaded, regardless of userName and userProject
	 */
	protected itptName: string | null;
	protected itptUserName: string;
	protected itptProjName: string;
	protected itptBlockName: string;

	/**
	 * userName of the currently logged in user, used for constructing new itptNames
	 */
	protected userName: string;
	/**
	 * project that the currently logged in user is editing, used for constructing new itptNames
	 */
	protected userProject: string;

	constructor(options: OutputInfoPartNodeModelOptions) {
		options.type = OUTPUT_INFO_MODEL;
		options.color = options.color ? options.color : editorSpecificNodesColor,
		super(options);
		this.setItptName(null);
		this.width = OUTPUT_NODE_WIDTH;
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deSerialize(event);
		this.setItptName(event.data.itptName);
	}

	serialize() {
		return merge(super.serialize(), {
			itptName: this.itptName
		});
	}

	getItptUserName() {
		return this.itptUserName;
	}

	getItptProjName() {
		return this.itptProjName;
	}

	getUserName() {
		return this.userName;
	}

	getUserProject() {
		return this.userProject;
	}

	setItptName(value: string) {
		if (value) {
			this.itptName = value;
			let splitValue = value.split("/");
			if (splitValue.length === 0) {
				this.itptUserName = null;
				this.itptProjName = null;
				this.itptBlockName = null;
			}
			if (splitValue.length === 1) {
				this.itptUserName = null;
				this.itptProjName = null;
				this.itptBlockName = splitValue[0];
			}
			if (splitValue.length === 2) {
				this.itptUserName = splitValue[0];
				this.itptProjName = null;
				this.itptBlockName = splitValue[1];
			}
			if (splitValue.length > 2) {
				this.itptUserName = splitValue[0];
				this.itptProjName = splitValue[1];
				splitValue = splitValue.slice(2);
				this.itptBlockName = splitValue.join("/");
			}
		}
	}
	getItptName() {
		return this.itptName;
	}
	getItptBlockName() {
		return this.itptBlockName;
	}

	public setSelected(selected: boolean = true) {
		//catching this event on purpose, if
	}

	hasMainItpt(): boolean {
		const inP = this.getInPorts();
		if (inP.length > 0) {
			const links = inP[0].getLinks();
			let elemCounter = 0;
			for (const key in links) {
				if (links.hasOwnProperty(key)) {
					elemCounter++;
					const element = links[key];
					if (!element.getSourcePort() || !element.getTargetPort()) return false;
				}
			}
			if (elemCounter !== 1) return false;
		}
		return true;
	}

	handleOutputInfoSaved() {
		const newItptName = this.itptName;
		this.fireEvent({
			itptName: newItptName
		},
			'outputInfoSaved');
	}
}
