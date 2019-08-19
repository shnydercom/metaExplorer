import { BaseEvent, BaseModelListener, DiagramEngine } from "storm-react-diagrams";
import { OUTPUT_INFO_MODEL } from "../node-editor-consts";
import { ItptNodeModel } from "../_super/ItptNodeModel";
import { merge } from "lodash";

export interface OutputInfoNodeModelListener extends BaseModelListener {
	outputInfoSaved?(event: BaseEvent<OutputInfoPartNodeModel> & { itptName: null | string }): void;
}

export const OUTPUT_NODE_WIDTH = 275;

export class OutputInfoPartNodeModel extends ItptNodeModel {

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

	constructor(nameSelf: string = "Untitled", subItptOf: string = null, canInterpretType: string = "", color: string = "rgb(0,192,255)", id?: string,
		           userName?: string, userProject?: string
	) {
		super(nameSelf, subItptOf, canInterpretType, color, OUTPUT_INFO_MODEL, id);
		this.nameSelf = nameSelf;
		this.color = color;
		this.setItptName(null);
		this.userName = userName,
		this.userProject = userProject;
		this.width = OUTPUT_NODE_WIDTH;
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.setItptName(object.itptName);
	}

	serialize() {
		return merge(super.serialize(), {
			itptName: this.itptName
		});
	}

	getItptUserName(){
		return this.itptUserName;
	}

	getItptProjName(){
		return this.itptProjName;
	}

	getUserName(){
		return this.userName;
	}

	getUserProject(){
		return this.userProject;
	}

	setItptName(value: string) {
		if (value){
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
	getItptBlockName(){
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
					if (!element.sourcePort || !element.targetPort) return false;
				}
			}
			if (elemCounter !== 1) return false;
		}
		return true;
	}

	handleOutputInfoSaved() {
		const newItptName = this.itptName;
		this.iterateListeners((listener: OutputInfoNodeModelListener, event: BaseEvent<OutputInfoPartNodeModel> & { itptName: null | string }) => {
			if (listener.outputInfoSaved) {
				listener.outputInfoSaved({ ...event, itptName: newItptName });
			}
		});
	}
}
