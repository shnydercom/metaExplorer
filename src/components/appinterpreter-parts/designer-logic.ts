import { BaseDataTypeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidgetFactory";
import { GeneralDataTypeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidgetFactory";
import { DiagramModel, DefaultNodeModel, DefaultPortModel, LinkModel, DiagramEngine, DefaultNodeFactory, DefaultLinkFactory } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IInterpreterInfoItem, DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { LDBaseDataType, ldBaseDataTypeList } from "ldaccess/LDBaseDataType";
import { IBlueprintInterpreter, BlueprintConfig } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "components/appinterpreter-parts/GeneralDataTypeNodeModel";

/**
 * @author Jonathan Schneider
 */
export class DesignerLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected interpreterList: IInterpreterInfoItem[];

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.registerNodeFactory(new DefaultNodeFactory());
		this.diagramEngine.registerLinkFactory(new DefaultLinkFactory());
		this.diagramEngine.registerNodeFactory(new BaseDataTypeWidgetFactory());
		this.diagramEngine.registerNodeFactory(new GeneralDataTypeWidgetFactory());
		this.newModel();
		this.interpreterList = (appIntprtrRetr() as DefaultInterpreterRetriever).getInterpreterList();
	}

	public newModel() {
		//2) setup the diagram model
		var model = new DiagramModel();

		var newNode1 = new BaseDataTypeNodeModel("Simple Data Type", "rgb(250,60,60)");
		var newPort1 = newNode1.addPort(new LDPortModel(false, "out-3", "someLabel"));
		newNode1.x = 100;
		newNode1.y = 200;
		model.addNode(newNode1);

		//3-A) create a default node
		var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
		var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
		node1.x = 100;
		node1.y = 100;

		//3-B) create another default node
		var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
		var port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
		node2.x = 400;
		node2.y = 100;

		//3-C) link the 2 nodes together
		var link1 = new LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		//4) add the models to the root graph
		model.addNode(node1);
		model.addNode(node2);
		model.addLink(link1);

		var linkNew = new LinkModel();
		linkNew.setSourcePort(newPort1);
		linkNew.setTargetPort(port1);
		model.addLink(linkNew);

		//5) load model into engine
		this.activeModel = model;
		this.diagramEngine.setDiagramModel(model);

	}

	public getActiveDiagram(): DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}

	public getInterpreterList(): IInterpreterInfoItem[] {
		//return only one interpreter for the simple data types, so remove others from return value
		let rv: IInterpreterInfoItem[] = [];
		let baseTypeIntrprtr: IInterpreterInfoItem;
		this.interpreterList.forEach((itm) => {
			let firstBTIfound: boolean = false;
			for (var index = 0; index < ldBaseDataTypeList.length; index++) {
				var element = ldBaseDataTypeList[index];
				if (itm.baseType === element) {
					if (!baseTypeIntrprtr) baseTypeIntrprtr = itm;
					firstBTIfound = true;
					break;
				}
			}
			if (firstBTIfound) return;
			rv.push(itm);
		});
		rv.unshift(baseTypeIntrprtr);
		return rv;
	}

	public addLDPortModelsToNode(node: GeneralDataTypeNodeModel, bpname: string): void {//: LDPortModel[] {
		let interpreter: IBlueprintInterpreter = appIntprtrRetr().getInterpreterByNameSelf(bpname);
		let cfg: BlueprintConfig = interpreter.cfg;
		let rv: LDPortModel[] = [];
		let intrprtrKeys: any[] = cfg.getInterpretableKeys();
		let initialKvStores: IKvStore[] = cfg.initialKvStores;
		node.name = bpname;
		for (var i = 0; i < intrprtrKeys.length; i++) {
			let elemi = intrprtrKeys[i];
			//let newLDPM: LDPortModel =
			let nName: string = "in_" + elemi;
			node.addPort(new LDPortModel(true, nName, elemi));
			console.dir(node.getPorts());
			//rv.push(newLDPM);
		}
		for (var j = 0; j < initialKvStores.length; j++) {
			console.dir(node.getPorts());
			var elemj = initialKvStores[j];
			let nName: string = "out_" + elemj.key;
			node.addPort(new LDPortModel(false, nName, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}
}
