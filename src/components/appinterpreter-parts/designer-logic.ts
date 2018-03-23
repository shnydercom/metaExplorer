import { BaseDataTypeWidgetFactory } from "components/appinterpreter-parts/BaseDataTypeWidgetFactory";
import { GeneralDataTypeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidgetFactory";
import { DiagramModel, DefaultNodeModel, DefaultPortModel, LinkModel, DiagramEngine, DefaultNodeFactory, DefaultLinkFactory, NodeModel } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IInterpreterInfoItem, DefaultInterpreterRetriever } from "defaults/DefaultInterpreterRetriever";
import { LDBaseDataType, ldBaseDataTypeList } from "ldaccess/LDBaseDataType";
import ldBlueprint, { IBlueprintInterpreter, BlueprintConfig } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "components/appinterpreter-parts/GeneralDataTypeNodeModel";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDDict } from "ldaccess/LDDict";
import { DeclarationWidgetFactory } from "components/appinterpreter-parts/DeclarationNodeWidgetFactory";
import { DeclarationPartNodeModel } from "components/appinterpreter-parts/DeclarationNodeModel";
import { DECLARATION_MODEL, BASEDATATYPE_MODEL, GENERALDATATYPE_MODEL } from "components/appinterpreter-parts/designer-consts";
import { InterpreterNodeModel } from "components/appinterpreter-parts/InterpreterNodeModel";
import { elementAt } from "rxjs/operators/elementAt";
import { ObjectPropertyRef, OBJECT_PROP_REF } from "ldaccess/ObjectPropertyRef";
import { DeclarationNodeProps } from "components/appinterpreter-parts/DeclarationNodeWidget";
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from "ldaccess/kvConvenienceFns";
import { ReduxInterpreterRetriever } from "ld-react-redux-connect/ReduxInterpreterRetriever";
import { isObjPropertyRef } from "ldaccess/ldUtils";

export var designerSpecificNodesColor = "rgba(87, 161, 245, 0.4)";

/**
 * @author Jonathan Schneider
 */
export class DesignerLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected interpreterList: IInterpreterInfoItem[];
	protected outputNode: DeclarationPartNodeModel;

	constructor(outputLDOptionsToken: string) {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.registerNodeFactory(new DefaultNodeFactory());
		this.diagramEngine.registerLinkFactory(new DefaultLinkFactory());
		this.diagramEngine.registerNodeFactory(new BaseDataTypeWidgetFactory());
		this.diagramEngine.registerNodeFactory(new GeneralDataTypeWidgetFactory());
		this.diagramEngine.registerNodeFactory(new DeclarationWidgetFactory());
		this.newModel(outputLDOptionsToken);
		this.interpreterList = (appIntprtrRetr() as ReduxInterpreterRetriever).getInterpreterList();
	}

	public newModel(outputLDOptionsToken: string) {
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
		let outputNode = new DeclarationPartNodeModel(UserDefDict.outputInterpreter, null, null, designerSpecificNodesColor,
			outputLDOptionsToken);
		//outputNode.setLocked(true); locking would lock the ports as well
		outputNode.x = 200;
		outputNode.y = 200;
		let outputFinalInputKV: IKvStore = {
			key: UserDefDict.finalInputKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
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
		let intrprtrKeys: any[] = cfg.interpretableKeys;
		let initialKvStores: IKvStore[] = cfg.initialKvStores;
		node.nameSelf = node.id;
		node.subInterpreterOf = bpname;
		let isInitKVsmallerThanKeys: boolean = initialKvStores.length < intrprtrKeys.length;
		for (var i = 0; i < intrprtrKeys.length; i++) {
			let elemi: IKvStore;
			if (isInitKVsmallerThanKeys) {
				if (i < initialKvStores.length - 1) {
					elemi = initialKvStores[i];
				} else {
					if (isObjPropertyRef(intrprtrKeys[i])) {
						elemi = {
							key: intrprtrKeys[i].propRef,
							value: undefined,
							ldType: undefined //TODO: determine or type here
						};
					} else {
						elemi = {
							key: intrprtrKeys[i],
							value: undefined,
							ldType: undefined
						};
					}
				}
			} else {
				elemi = initialKvStores[i];
			}
			//let newLDPM: LDPortModel =
			let nName: string = elemi.key;
			//don't add KvStores that already have a value, unless they are InterpreterReferenceMap-typed
			if (!elemi.value) {
				node.addPort(new LDPortModel(true, nName, elemi));
			} else if (elemi.ldType === UserDefDict.intrprtrBPCfgRefMapType) {
				let objPropRef: ObjectPropertyRef = intrprtrKeys[i];
				let nestedKey = objPropRef.propRef;
				let nestedType = getKVStoreByKeyFromLDOptionsOrCfg(null, elemi.value[objPropRef.objRef], nestedKey).ldType;
				let elemiNested: IKvStore = {
					key: nestedKey,
					value: undefined,
					ldType: nestedType
				};
				node.addPort(new LDPortModel(true, nestedKey, elemiNested));
			}

			//node.addPort(new LDPortModel(true, "identifier", { key: null, value: null, ldType: null }));
			console.dir(node.getPorts());
			//rv.push(newLDPM);
		}
		//interpreter always exports itself
		let exportSelfKV: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		node.addPort(new LDPortModel(false, exportSelfKV.key, exportSelfKV));
		for (var j = intrprtrKeys.length; j < initialKvStores.length; j++) {
			console.dir(node.getPorts());
			var elemj = initialKvStores[j];
			if (elemj.ldType === UserDefDict.intrprtrBPCfgRefMapType) continue;
			let nName: string = "out_" + elemj.key;
			node.addPort(new LDPortModel(false, nName, elemj, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}

	/**
	 * adds a blueprint defined in the designer to the AppInterpreterRetriever, automatically looks
	 * for the correct React-Class to extend
	 * @param input the BlueprintConfig used as a setup for the new Interpreter
	 */
	public addBlueprintToRetriever(input: BlueprintConfig) {
		let retriever = appIntprtrRetr() as ReduxInterpreterRetriever;
		let candidate = retriever.getUnconnectedByNameSelf(input.subInterpreterOf);
		if (!candidate) {
			//check if it's well-defined
			let refMap = getKVStoreByKey(input.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);
			if (!refMap || !refMap.value || refMap.value === {}) return;
			if (!refMap.value[input.subInterpreterOf]) return;
			let searchTerm: string = UserDefDict.intrprtrBPCfgRefMapName;
			candidate = retriever.getUnconnectedByNameSelf(searchTerm);
		}
		if (!candidate) return;
		let interpreterContainer: any = ldBlueprint(input)(candidate); //actually wraps, doesn't extend
		//interpreterContainer.cfg = input;
		retriever.addInterpreter(input.canInterpretType, interpreterContainer, "cRud");
	}

	public intrprtrTypeInstanceFromBlueprint(input: BlueprintConfig): any {
		if (!input) return null;
		let rv = {};
		input.interpretableKeys.forEach((val) => {
			try {
				let propID: string = (val as ObjectPropertyRef).propRef;
				rv[propID] = null;
			} catch (error) {
				rv[val as string] = null;
			}
		});
		return rv;
	}

	public intrprtrBlueprintFromDiagram(finalCanInterpretType?: string): BlueprintConfig {
		let rv: BlueprintConfig;
		if (!this.outputNode) return null;
		let crudSkills = "cRud";
		let nameSelf = null;
		let initialKvStores = [];
		let interpretableKeysArr = [];
		let canInterpretType = finalCanInterpretType ? finalCanInterpretType : null;
		//TODO: fill the above recursively
		let outputBPCfg: BlueprintConfig = {
			subInterpreterOf: null,
			canInterpretType: canInterpretType,
			nameSelf: nameSelf,
			initialKvStores: initialKvStores,
			crudSkills: crudSkills,
			interpretableKeys: interpretableKeysArr,
		};
		let subIntrprtrCfgMap: { [s: string]: BlueprintConfig } = {};
		this.fillBPCfgFromGraph(outputBPCfg, this.outputNode, subIntrprtrCfgMap, outputBPCfg);
		let intrprtMapKV: IKvStore =
			{
				key: UserDefDict.intrprtrBPCfgRefMapKey,
				value: subIntrprtrCfgMap,
				ldType: UserDefDict.intrprtrBPCfgRefMapType
			};
		outputBPCfg.subInterpreterOf = this.outputNode.subInterpreterOf;
		outputBPCfg.initialKvStores.push(intrprtMapKV);
		this.bakeKvStoresIntoBP(outputBPCfg);
		return outputBPCfg;
	}

	/**
	 * recursive helper function to enrich the graph with blueprint-data, so that it can be
	 * interpreted by the generic container
	 * @param branchBPCfg the BlueprintConfig to fill
	 * @param branchNode the NodeModel used to fill branchBPCfg, on the same level!
	 * @param topBPCfg the root or top node, i.e. the node where the recursive process started
	 */
	private fillBPCfgFromGraph(branchBPCfg: BlueprintConfig, branchNode: InterpreterNodeModel, otherIntrprtrCfgs: { [s: string]: BlueprintConfig },
		topBPCfg: BlueprintConfig) {
		let inPorts: LDPortModel[] = branchNode.getInPorts();
		inPorts.forEach((port) => {
			let links = port.getLinks();
			for (const key in links) {
				if (links.hasOwnProperty(key)) {
					const oneLink = links[key];
					let leafNode: NodeModel = oneLink.getSourcePort().getParent();
					let leafPort: LDPortModel = oneLink.getSourcePort() as LDPortModel;
					if (leafNode.getID() === branchNode.getID()) {
						leafNode = oneLink.getTargetPort().getParent();
						leafPort = oneLink.getTargetPort() as LDPortModel;
					}
					switch (leafNode.nodeType) {
						case DECLARATION_MODEL:
							let declarModel: DeclarationPartNodeModel = leafNode as DeclarationPartNodeModel;
							let declarID = declarModel.getID();
							if (leafPort.kv && leafPort.kv.key === UserDefDict.externalInput) {
								//is an external input marker
								let keyInputMarked = port.kv.key;
								let inputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyInputMarked };
								let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								cfgIntrprtKeys.push(inputObjPropRef);
								branchBPCfg.initialKvStores.push(this.copyKV(port.kv));
								branchBPCfg.interpretableKeys.push(port.kv.key);
							}
							break;
						case BASEDATATYPE_MODEL:
							let bdtLeafNode: BaseDataTypeNodeModel = leafNode as BaseDataTypeNodeModel;
							let bdtKV = this.composeKVs(bdtLeafNode.getOutPorts()[0].kv, port.kv);
							branchBPCfg.initialKvStores.push(bdtKV);
							console.log(bdtKV);
							//TODO: check here, that BDT-Nodes hand up their input correctly
							break;
						case GENERALDATATYPE_MODEL:
							let leafNodeID = leafNode.getID();
							let outputBPCfg: BlueprintConfig = otherIntrprtrCfgs[leafNodeID];
							let initialKvStores = null;
							if (!outputBPCfg) {
								let canInterpretType = (leafNode as InterpreterNodeModel).canInterpretType;
								let subInterpreterOf = (leafNode as InterpreterNodeModel).subInterpreterOf;
								let crudSkills = "cRud";
								let nameSelf = leafNodeID;
								initialKvStores = [];
								let interpretableKeysArr = [];
								outputBPCfg = outputBPCfg ? outputBPCfg : {
									subInterpreterOf: subInterpreterOf,
									canInterpretType: canInterpretType,
									nameSelf: nameSelf,
									initialKvStores: initialKvStores,
									crudSkills: crudSkills,
									interpretableKeys: interpretableKeysArr,
								};
								otherIntrprtrCfgs[leafNodeID] = outputBPCfg;
								this.fillBPCfgFromGraph(outputBPCfg, leafNode as InterpreterNodeModel, otherIntrprtrCfgs, topBPCfg);
							} else {
								initialKvStores = outputBPCfg.initialKvStores;
							}
							let outputType: string = leafPort.kv.ldType;
							let propRef = leafPort.kv.key === UserDefDict.exportSelfKey ? null : leafPort.kv.key;
							let outputRef: ObjectPropertyRef = {
								objRef: leafNodeID,
								propRef: propRef
							};
							let outputKV: IKvStore = {
								key: leafPort.kv.key,
								value: outputRef,
								ldType: outputType
							};
							let gdtKV = this.composeKVs(outputKV, port.kv);
							branchBPCfg.initialKvStores.push(gdtKV);
							//extra handling so that the final output-class.subInterpretOf property and intererpretableKeys on subInterpreters
							if (branchNode.nodeType === DECLARATION_MODEL && port.kv.key === UserDefDict.finalInputKey) {
								branchNode.subInterpreterOf = leafNode.getID();
							} else {
								branchBPCfg.interpretableKeys.push(gdtKV.key);
							}
							break;
						default:
							break;
					}
				}
			}
		});
	}

	/**
	 * composes the KvStore from a target and a source node. Used to make a property on a BPCfg from a link
	 * @param sourceKV
	 * @param targetKV
	 */
	private composeKVs(sourceKV: IKvStore, targetKV: IKvStore): IKvStore {
		let rv: IKvStore = null;
		if ((sourceKV.ldType && targetKV.ldType) &&
			(sourceKV.ldType !== targetKV.ldType)) return targetKV;
		rv = {
			key: targetKV.key,
			value: sourceKV.value,
			ldType: targetKV.ldType
		};
		return rv;
	}

	private copyKVforExport(sourceKV: IKvStore): IKvStore {
		let newKVStore: IKvStore = this.copyKV(sourceKV);
		if (newKVStore.value && newKVStore.value.hasOwnProperty(OBJECT_PROP_REF)) {
			(sourceKV.value as ObjectPropertyRef).propRef = null;
		}
		return newKVStore;
	}

	private copyKV(sourceKV: IKvStore): IKvStore {
		let rv: IKvStore = {
			key: sourceKV.key,
			value: sourceKV.value,
			ldType: sourceKV.ldType,
			intrprtrClass: sourceKV.intrprtrClass
		};
		return rv;
	}

	private bakeKvStoresIntoBP(targetBP: BlueprintConfig) {
		if (!targetBP) return;
		let kvStores: IKvStore[] = targetBP.initialKvStores;
		if (!kvStores || kvStores.length === 0) return;
		let idxMap: Map<string, number> = new Map();
		kvStores.forEach((itm, idx) => {
			if (itm) {
				//TODO: is there a more elegant way for comparing against multiple strings?
				switch (itm.key) {
					case UserDefDict.finalInputKey:
						idxMap.set(itm.key, idx);
						break;
					case UserDefDict.intrprtrNameKey:
						idxMap.set(itm.key, idx);
						break;
					default:
						break;
				}
			}
		});
		idxMap.forEach((val, key) => {
			switch (key) {
				case UserDefDict.finalInputKey:
					//targetBP.canInterpretType = (kvStores[val].value as ObjectPropertyRef).objRef;
					/**
					 * sieht so aus: {
      "key": "finalInput",
      "value": {
        "objRef": "9e47cf47-f756-4b53-bacf-c8dc269ba5e2",
        "propRef": "exportSelf"
      },
      "ldType": "InterpreterType"
    },
					 */
					break;
				case UserDefDict.intrprtrNameKey:
					targetBP.nameSelf = kvStores[val].value;
					break;
				default:
					break;
			}
		});
		console.dir(idxMap);
		//delete at the end
		let lastVal = 0;
		idxMap.forEach((val, key) => {
			kvStores.splice(val, 1);
			idxMap.forEach((val2, key2) => {
				if (val2 > val) idxMap.set(key2, val2 - 1);
			});
		});
		console.dir(idxMap);
	}
}
