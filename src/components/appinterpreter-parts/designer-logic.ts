import { BaseDataTypeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidgetFactory";
import { GeneralDataTypeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidgetFactory";
import { DiagramModel, DefaultNodeModel, DefaultPortModel, LinkModel, DiagramEngine, DefaultNodeFactory, DefaultLinkFactory, NodeModel } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IInterpreterInfoItem, DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { LDBaseDataType, ldBaseDataTypeList } from "ldaccess/LDBaseDataType";
import { IBlueprintInterpreter, BlueprintConfig } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "components/appinterpreter-parts/GeneralDataTypeNodeModel";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDDict } from "ldaccess/LDDict";
import { DeclarationWidgetFactory } from "components/appinterpreter-parts/DeclarationNodeWidgetFactory";
import { DeclarationPartNodeModel } from "components/appinterpreter-parts/DeclarationNodeModel";
import { DECLARATION_MODEL, BASEDATATYPE_MODEL, GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { elementAt } from "rxjs/operators/elementAt";

export var designerSpecificNodesColor = "rgba(87, 161, 245, 0.4)";

/**
 * @author Jonathan Schneider
 */
export class DesignerLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected interpreterList: IInterpreterInfoItem[];
	protected outputNode: DeclarationPartNodeModel;

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.registerNodeFactory(new DefaultNodeFactory());
		this.diagramEngine.registerLinkFactory(new DefaultLinkFactory());
		this.diagramEngine.registerNodeFactory(new BaseDataTypeWidgetFactory());
		this.diagramEngine.registerNodeFactory(new GeneralDataTypeWidgetFactory());
		this.diagramEngine.registerNodeFactory(new DeclarationWidgetFactory());
		this.newModel();
		this.interpreterList = (appIntprtrRetr() as DefaultInterpreterRetriever).getInterpreterList();
	}

	public newModel() {
		//2) setup the diagram model
		var model = new DiagramModel();

		/*var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: undefined
		};
		var newNode1 = new BaseDataTypeNodeModel("Simple Data Type",  "rgba(250,250,250,0.2)");
		var newPort1 = newNode1.addPort(new LDPortModel(false, "out-3", baseDataTypeKVStore, "someLabel"));
		newNode1.x = 100;
		newNode1.y = 200;
		model.addNode(newNode1);

		//3-A) create a default node
		var node1 = new DefaultNodeModel("Node 1",  "rgba(250,250,250,0.2)");
		var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
		node1.x = 100;
		node1.y = 100;

		//3-B) create another default node
		var node2 = new DefaultNodeModel("Node 2",  "rgba(250,250,250,0.2)");
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
		model.addLink(linkNew);*/

		//create fixed output node
		//TODO: make fixed but ports should still be settable, make outputNode singleton per Interpreter
		let outputNode = new DeclarationPartNodeModel(UserDefDict.outputInterpreter, designerSpecificNodesColor);
		//outputNode.setLocked(true); locking would lock the ports as well
		outputNode.x = 600;
		outputNode.y = 200;
		let outputFinalInputKV: IKvStore = {
			key: UserDefDict.finalInputKey,
			value: undefined,
			ldType: UserDefDict.intrptrtType
		};
		let finalInputName: string = outputFinalInputKV.key;
		outputNode.addPort(new LDPortModel(true, finalInputName, outputFinalInputKV));
		let interpreterNameKV: IKvStore = {
			key: UserDefDict.intrprtrNameKey,
			value: undefined,
			ldType: LDDict.Text
		};
		let interpreterNameString: string = UserDefDict.intrprtrNameKey;
		outputNode.addPort(new LDPortModel(true, interpreterNameString, interpreterNameKV));
		model.addNode(outputNode);

		this.outputNode = outputNode;
		//5) load model into engine
		this.activeModel = model;
		this.diagramEngine.setDiagramModel(model);

	}

	public getActiveModel(): DiagramModel {
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
		let isInitKVsmallerThanKeys: boolean = initialKvStores.length < intrprtrKeys.length;
		for (var i = 0; i < intrprtrKeys.length; i++) {
			let elemi: IKvStore;
			if (isInitKVsmallerThanKeys) {
				if (i < initialKvStores.length - 1) {
					elemi = initialKvStores[i];
				} else {
					elemi = {
						key: intrprtrKeys[i],
						value: undefined,
						ldType: undefined
					};
				}
			} else {
				elemi = initialKvStores[i];
			}
			//let newLDPM: LDPortModel =
			let nName: string = elemi.key;
			//don't add KvStores that already have a value
			if (!elemi.value) {
				node.addPort(new LDPortModel(true, nName, elemi));
			}
			console.dir(node.getPorts());
			//rv.push(newLDPM);
		}
		//interpreter always exports itself
		let exportSelfKV: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: cfg.forType
		};
		node.addPort(new LDPortModel(false, exportSelfKV.key, exportSelfKV));
		for (var j = intrprtrKeys.length; j < initialKvStores.length; j++) {
			console.dir(node.getPorts());
			var elemj = initialKvStores[j];
			let nName: string = "out_" + elemj.key;
			node.addPort(new LDPortModel(false, nName, elemj, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}

	public intrprtrBlueprintFromDiagram(): BlueprintConfig {
		let rv: BlueprintConfig;
		if (!this.outputNode) return null;
		let crudSkills = "cRud";
		let nameSelf = null;
		let initialKvStores = [];
		let interpretableKeysArr = [];

		//TODO: fill the above recursively

		let outputBPCfg: BlueprintConfig = {
			forType: LDDict.ViewAction,
			nameSelf: nameSelf,
			interpreterRetrieverFn: appIntprtrRetr,
			initialKvStores: initialKvStores,
			crudSkills: crudSkills,
			getInterpretableKeys: () => interpretableKeysArr,
		};
		this.fillBPCfgFromGraph(outputBPCfg, this.outputNode);
		return outputBPCfg;
	}

	/**
	 * helper function to enrich the graph with blueprint-data, so that it can be
	 * interpreted by the generic container
	 * @param branchBPCfg the BlueprintConfig to fill
	 * @param branchNode the NodeModel used to fill branchBPCfg, on the same level!
	 */
	private fillBPCfgFromGraph(branchBPCfg: BlueprintConfig, branchNode: InterpreterNodeModel) {
		let inPorts: LDPortModel[] = branchNode.getInPorts();
		inPorts.forEach((port) => {
			let links = port.getLinks();
			for (const key in links) {
				if (links.hasOwnProperty(key)) {
					const oneLink = links[key];
					let leafNode: NodeModel = oneLink.getSourcePort().getParent();
					if (leafNode.getID() === branchNode.getID()) {
						leafNode = oneLink.getTargetPort().getParent();
					}
					switch (leafNode.nodeType) {
						case DECLARATION_MODEL:
							break;
						case BASEDATATYPE_MODEL:
							let bdtLeafNode: BaseDataTypeNodeModel = leafNode as BaseDataTypeNodeModel;
							let bdtKV = bdtLeafNode.getOutPorts()[0].kv;
							branchBPCfg.initialKvStores.push(bdtKV);
							console.log(bdtKV);
							//TODO: check here, that BDT-Nodes hand up their input correctly
							break;
						case GENERALDATATYPE_MODEL:
							let forType = null;
							let crudSkills = "cRud";
							let nameSelf = null;
							let initialKvStores = [];
							let interpretableKeysArr = [];
							let outputBPCfg: BlueprintConfig = {
								forType: forType,
								nameSelf: nameSelf,
								interpreterRetrieverFn: appIntprtrRetr,
								initialKvStores: initialKvStores,
								crudSkills: crudSkills,
								getInterpretableKeys: () => interpretableKeysArr,
							};
							this.fillBPCfgFromGraph(outputBPCfg, leafNode as InterpreterNodeModel);
							break;
						default:
							break;
					}
				}
			}
		});

	}

}
