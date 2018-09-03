import { keys } from "lodash";
import { DiagramModel, LinkModel, DiagramEngine, DefaultNodeFactory, DefaultLinkFactory, NodeModel } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "./basedatatypes/BaseDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";
import appIntprtrRetr from 'appconfig/appItptRetriever';
import { IItptInfoItem } from "defaults/DefaultItptRetriever";
import { LDBaseDataType, ldBaseDataTypeList } from "ldaccess/LDBaseDataType";
import ldBlueprint, { IBlueprintItpt, BlueprintConfig } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "./generaldatatypes/GeneralDataTypeNodeModel";
import { UserDefDict } from "ldaccess/UserDefDict";
import { LDDict } from "ldaccess/LDDict";
import { DeclarationWidgetFactory } from "./declarationtypes/DeclarationNodeWidgetFactory";
import { DeclarationPartNodeModel } from "./declarationtypes/DeclarationNodeModel";
import { DECLARATION_MODEL, BASEDATATYPE_MODEL, GENERALDATATYPE_MODEL, EXTENDABLETYPES_MODEL } from "./designer-consts";
import { ItptNodeModel } from "./ItptNodeModel";
import { elementAt } from "rxjs/operators/elementAt";
import { ObjectPropertyRef, OBJECT_PROP_REF } from "ldaccess/ObjectPropertyRef";
import { DeclarationNodeProps } from "./declarationtypes/DeclarationNodeWidget";
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from "ldaccess/kvConvenienceFns";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { ExtendableTypesWidgetFactory } from "./extendabletypes/ExtendableTypesWidgetFactory";
import { COMP_BASE_CONTAINER } from "../../generic/baseContainer-rewrite";
import { GeneralDataTypeNodeFactory } from "./generaldatatypes/GeneralDataTypeInstanceFactories";
import { BaseDataTypeNodeFactory } from "./basedatatypes/BaseDataTypeInstanceFactories";
// import { value } from "../../../../node_modules/react-toolbox/lib/dropdown/theme.css";

import { distributeElements } from "./dagre-utils";
import { LDPortInstanceFactory } from "./LDPortInstanceFactory";
import { isInputValueValidFor } from "ldaccess/ldtypesystem/typeChecking";
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";

export interface NewNodeSig {
	x: number;
	y: number;
	id: string;
}

export const DIAG_TRANSF_X = -250;
export const DIAG_TRANSF_Y = 200;
export const PORTNAME_OUT_EXPORTSELF = "out-expSelf";

export var designerSpecificNodesColor = "rgba(87, 161, 245, 0.4)";

/**
 * @author Jonathan Schneider
 */
export class DesignerLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected itptList: IItptInfoItem[];
	protected outputNode: DeclarationPartNodeModel;
	protected outputLDOptionsToken: string;

	constructor(outputLDOptionsToken: string) {
		this.outputLDOptionsToken = outputLDOptionsToken;
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.registerNodeFactory(new DefaultNodeFactory());
		this.diagramEngine.registerLinkFactory(new DefaultLinkFactory());
		this.diagramEngine.registerNodeFactory(new BaseDataTypeNodeFactory());
		this.diagramEngine.registerNodeFactory(new GeneralDataTypeNodeFactory());
		this.diagramEngine.registerNodeFactory(new DeclarationWidgetFactory());
		this.diagramEngine.registerNodeFactory(new ExtendableTypesWidgetFactory());
		this.diagramEngine.registerPortFactory(new LDPortInstanceFactory());
		this.newModel(outputLDOptionsToken);
		this.itptList = (appIntprtrRetr() as ReduxItptRetriever).getItptList();
	}

	public clear() {
		this.newModel(this.outputLDOptionsToken);
	}

	public autoDistribute() {
		const engine = this.diagramEngine;
		const model = engine.getDiagramModel();
		let distributedModel = this.getDistributedModel(engine, model);
		this.activeModel = distributedModel;
		this.outputNode = this.activeModel.getNode(this.outputLDOptionsToken) as DeclarationPartNodeModel;
		engine.setDiagramModel(distributedModel);
		engine.recalculatePortsVisually();
		engine.zoomToFit();
	}

	public getDistributedModel(engine, model) {
		const serialized = model.serializeDiagram();
		const distributedSerializedDiagram = distributeElements(serialized);
		//deserialize the model
		let deSerializedModel = new DiagramModel();
		deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
		return deSerializedModel;
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
		//TODO: make fixed but ports should still be settable, make outputNode singleton per Itpt
		let outputNode = new DeclarationPartNodeModel(UserDefDict.outputItpt, null, null, designerSpecificNodesColor,
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
		let itptNameKV: IKvStore = {
			key: UserDefDict.intrprtrNameKey,
			value: undefined,
			ldType: LDDict.Text
		};
		let itptNameString: string = UserDefDict.intrprtrNameKey;
		outputNode.addPort(new LDPortModel(true, itptNameString, itptNameKV));
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

	public getItptList(): IItptInfoItem[] {
		//return only one Itpt for the simple data types, so remove others from return value
		let rv: IItptInfoItem[] = [];
		let baseTypeIntrprtr: IItptInfoItem;
		this.itptList.forEach((itm) => {
			let firstBTIfound: boolean = false;
			for (var index = 0; index < ldBaseDataTypeList.length; index++) {
				var element = ldBaseDataTypeList[index];
				if (itm.baseType === element) {
					if (!baseTypeIntrprtr) baseTypeIntrprtr = itm;
					firstBTIfound = true;
					break;
				}
			}
			//if (firstBTIfound) return;
			rv.push(itm);
		});
		//rv.unshift(baseTypeIntrprtr);
		return rv;
	}

	public addLDPortModelsToNodeFromItptRetr(node: ItptNodeModel, bpname: string): void {//: LDPortModel[] {
		let itpt: IBlueprintItpt = appIntprtrRetr().getItptByNameSelf(bpname);
		let cfg: BlueprintConfig = itpt.cfg;
		this.addLDPortModelsToNodeFromCfg(node, cfg);
	}
	public addLDPortModelsToNodeFromCfg(node: ItptNodeModel, cfg: BlueprintConfig) {
		let rv: LDPortModel[] = [];
		let intrprtrKeys: any[] = cfg.interpretableKeys;
		let initialKvStores: IKvStore[] = cfg.initialKvStores;
		node.nameSelf = node.id;
		node.subItptOf = cfg.nameSelf;
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
			let nName: string = elemi.key + "_in";
			//don't add KvStores that already have a value, unless they are ItptReferenceMap-typed
			if (!elemi.value) {
				node.addPort(new LDPortModel(true, nName, elemi, elemi.key));
			} else

				if (elemi.ldType === UserDefDict.intrprtrBPCfgRefMapType) {
					let objPropRef: ObjectPropertyRef = intrprtrKeys[i];
					let nestedKey = objPropRef.propRef;
					let nestedType = getKVStoreByKeyFromLDOptionsOrCfg(null, elemi.value[objPropRef.objRef], nestedKey).ldType;
					let elemiNested: IKvStore = {
						key: nestedKey,
						value: undefined,
						ldType: nestedType
					};
					let nestedName = nestedKey + "_in";
					node.addPort(new LDPortModel(true, nestedName, elemiNested, nestedKey));
				}
				else if (elemi.ldType === UserDefDict.intrprtrClassType) {
					let newInKV: IKvStore = {
						key: elemi.key,
						value: undefined,
						ldType: UserDefDict.intrprtrClassType
					};
					node.addPort(new LDPortModel(true, elemi.key + "_in", newInKV, elemi.key));
				}

			//node.addPort(new LDPortModel(true, "identifier", { key: null, value: null, ldType: null }));
			console.dir(node.getPorts());
			//rv.push(newLDPM);
		}
		//Itpt always exports itself
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
			let nName: string = elemj.key + "_out";
			node.addPort(new LDPortModel(false, nName, elemj, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}

	/**
	 * adds a blueprint defined in the designer to the AppItptRetriever, automatically looks
	 * for the correct React-Class to extend
	 * @param input the BlueprintConfig used as a setup for the new Itpt
	 */
	public addBlueprintToRetriever(input: BlueprintConfig) {
		let retriever = appIntprtrRetr() as ReduxItptRetriever;
		let candidate = retriever.getUnconnectedByNameSelf(input.subItptOf);
		if (!candidate) {
			//check if it's well-defined
			let refMap = getKVStoreByKey(input.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);
			if (!refMap || !refMap.value || refMap.value === {}) return;
			if (!refMap.value[input.subItptOf]) return;
			let searchTerm: string = UserDefDict.intrprtrBPCfgRefMapName;
			candidate = retriever.getUnconnectedByNameSelf(searchTerm);
		}
		if (!candidate) return;
		let itptContainer: any = ldBlueprint(input)(candidate); //actually wraps, doesn't extend
		retriever.addItpt(input.canInterpretType, itptContainer, "cRud");
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

	public diagramFromItptBlueprint(itpt: BlueprintConfig): void {
		let newSigBaseTxt: NewNodeSig = {
			id: this.outputNode.id + UserDefDict.intrprtrNameKey,
			x: this.outputNode.x + DIAG_TRANSF_X,
			y: this.outputNode.y + DIAG_TRANSF_Y
		};
		let nameTextNode = this.addNewBDTNode(newSigBaseTxt, LDDict.Text, itpt.nameSelf);
		let nameTextNodeOutPort = nameTextNode.getPort(PORTNAME_OUT_EXPORTSELF);
		let refMap = getKVStoreByKey(itpt.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);

		// let mainItpt = refMap.value[itpt.subItptOf];
		let newSigBaseItpt: NewNodeSig = { id: itpt.subItptOf, x: newSigBaseTxt.x, y: newSigBaseTxt.y - DIAG_TRANSF_Y };
		//let baseNode = this.addNewGeneralNode(newSigBaseItpt, mainItpt);

		//create nodes first
		let nodeMap = new Map<string, GeneralDataTypeNodeModel>();
		//nodeMap.set(itpt.subItptOf, baseNode);
		let yIterator = 0;
		for (const itm in refMap.value) {
			if (refMap.value.hasOwnProperty(itm)) {
				const subItpt: BlueprintConfig = refMap.value[itm];
				//if (subItpt === mainItpt) continue;
				yIterator++;
				let newSigSubItpt: NewNodeSig = { id: itm, x: newSigBaseItpt.x, y: newSigBaseItpt.y - DIAG_TRANSF_Y * yIterator };
				if (subItpt.canInterpretType === UserDefDict.itptContainerObjType) {
					let extendableNode = this.addNewExtendableNode(newSigSubItpt, subItpt);
					nodeMap.set(itm, extendableNode);
					continue;
				}
				let subNode = this.addNewGeneralNode(newSigSubItpt, subItpt);
				nodeMap.set(itm, subNode);
			}
		}

		//create links between nodes
		let linkArray = [];
		for (const itm in refMap.value) {
			if (refMap.value.hasOwnProperty(itm)) {
				const subItpt: BlueprintConfig = refMap.value[itm];
				const targetNode = nodeMap.get(itm);
				subItpt.initialKvStores.forEach((kvItm, idx) => {
					let sourcePort: LDPortModel;
					let targetPort: LDPortModel;
					targetPort = targetNode.getPort(kvItm.key + "_in") as LDPortModel;
					if (isObjPropertyRef(kvItm.value)) {
						const kvValAsObjPropRef: ObjectPropertyRef = kvItm.value as ObjectPropertyRef;
						let sourceNode = nodeMap.get(kvValAsObjPropRef.objRef);
						if (kvValAsObjPropRef.propRef === null) {
							sourcePort = sourceNode.getPort(UserDefDict.exportSelfKey) as LDPortModel;
						} else {
							sourcePort = sourceNode.getPort(kvValAsObjPropRef.propRef + "_out") as LDPortModel;
						}
					} else {
						if (kvItm.value === undefined) return;
						let bdtStaticNode;
						let newBDTSig: NewNodeSig = { id: itm, x: newSigBaseItpt.x + DIAG_TRANSF_X, y: newSigBaseItpt.y - DIAG_TRANSF_Y * idx };
						if (!kvItm.ldType || kvItm.ldType === LDDict.Text) {
							bdtStaticNode = this.addNewBDTNode(newBDTSig, LDDict.Text, kvItm.value);
						} else {
							bdtStaticNode = this.addNewBDTNode(newBDTSig, kvItm.ldType, kvItm.value);
						}
						sourcePort = bdtStaticNode.getPort(PORTNAME_OUT_EXPORTSELF) as LDPortModel;
					}
					let subItptLink = new LinkModel();
					subItptLink.setSourcePort(sourcePort);
					subItptLink.setTargetPort(targetPort);
					linkArray.push(subItptLink);
				});
			}
		}

		//create nodes and Links for external input markers
		for (let itptKeysIdx = 0; itptKeysIdx < itpt.interpretableKeys.length; itptKeysIdx++) {
			const a = itpt.interpretableKeys[itptKeysIdx];
			if (isObjPropertyRef(a)) {
				let itptKeyField: ObjectPropertyRef = a as ObjectPropertyRef;
				var inputDataTypeKVStore: IKvStore = {
					key: UserDefDict.externalInput,
					value: undefined,
					ldType: undefined
				};
				let inputMarkerNode = new DeclarationPartNodeModel("External Input Marker", null, null, designerSpecificNodesColor);
				let inputMarkerPort = inputMarkerNode.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
				this.getDiagramEngine()
					.getDiagramModel()
					.addNode(inputMarkerNode);
				let targetNode = nodeMap.get(itptKeyField.objRef);
				let targetPort = targetNode.getPort(itptKeyField.propRef + "_in");
				let inputMarkerLink = new LinkModel();
				inputMarkerLink.setSourcePort(inputMarkerPort);
				inputMarkerLink.setTargetPort(targetPort);
				linkArray.push(inputMarkerLink);
			}
		}

		let baseNode = nodeMap.get(itpt.subItptOf);

		let outputNodeItptInPort = this.outputNode.getPort(UserDefDict.finalInputKey);
		let outputNodeNameInPort = this.outputNode.getPort(UserDefDict.intrprtrNameKey);

		let outputItptLink = new LinkModel();
		outputItptLink.setTargetPort(outputNodeItptInPort);
		outputItptLink.setSourcePort(baseNode.getPort(UserDefDict.exportSelfKey));

		let outputNameLink = new LinkModel();
		outputNameLink.setTargetPort(outputNodeNameInPort);
		outputNameLink.setSourcePort(nameTextNodeOutPort);

		this.getDiagramEngine().recalculatePortsVisually();
		this.getDiagramEngine().getDiagramModel().addLink(outputNameLink);
		this.getDiagramEngine().getDiagramModel().addLink(outputItptLink);
		console.log(linkArray.length);
		linkArray.forEach((link) => {
			this.getDiagramEngine().getDiagramModel().addLink(link);
		});
	}

	public addNewExtendableNode(signature: NewNodeSig, itpt: BlueprintConfig): ExtendableTypesNodeModel {
		let extendableNode = new ExtendableTypesNodeModel("Linear Data Display", null, null, designerSpecificNodesColor);
		let nodeName: string = itpt.subItptOf;
		extendableNode.id = signature.id;
		extendableNode.x = signature.x;
		extendableNode.y = signature.y;
		extendableNode.canInterpretType = itpt.canInterpretType;
		let exportSelfKV: IKvStore = {
			key: UserDefDict.exportSelfKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		this.addLDPortModelsToNodeFromCfg(extendableNode, itpt);
		this.getDiagramEngine()
			.getDiagramModel()
			.addNode(extendableNode);
		//extendableNode.addPort(new LDPortModel(false, exportSelfKV.key, exportSelfKV));
		return extendableNode;
	}

	public addNewGeneralNode(signature: NewNodeSig, itpt: BlueprintConfig): GeneralDataTypeNodeModel {
		let nodeName: string = itpt.subItptOf;
		let generalNode = new GeneralDataTypeNodeModel(nodeName, null, null, "rgba(250,250,250,0.2)");
		generalNode.id = signature.id;
		generalNode.x = signature.x;
		generalNode.y = signature.y;
		this.addLDPortModelsToNodeFromItptRetr(generalNode, nodeName);
		if (itpt.canInterpretType) generalNode.canInterpretType = itpt.canInterpretType;
		this.getDiagramEngine()
			.getDiagramModel()
			.addNode(generalNode);
		return generalNode;
	}

	public addNewBDTNode(signature: NewNodeSig, ldType: string, value: any): BaseDataTypeNodeModel {
		if (ldType !== LDDict.Boolean &&
			ldType !== LDDict.Integer &&
			ldType !== LDDict.Double &&
			ldType !== LDDict.Text &&
			ldType !== LDDict.Date &&
			ldType !== LDDict.DateTime) {
			ldType = LDDict.Text;
		}
		var baseDataTypeKVStore: IKvStore = {
			key: UserDefDict.singleKvStore,
			value: value,
			ldType: ldType
		};
		let node = new BaseDataTypeNodeModel("Simple Data Type", null, null, "rgba(250,250,250,0.2)");
		node.x = signature.x;
		node.y = signature.y;
		node.addPort(new LDPortModel(false, PORTNAME_OUT_EXPORTSELF, baseDataTypeKVStore, "output", signature.id));
		this.getDiagramEngine()
			.getDiagramModel()
			.addNode(node);
		return node;
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
			subItptOf: null,
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
		outputBPCfg.subItptOf = this.outputNode.subItptOf;
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
	private fillBPCfgFromGraph(
		branchBPCfg: BlueprintConfig,
		branchNode: ItptNodeModel,
		otherIntrprtrCfgs: { [s: string]: BlueprintConfig },
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
					switch (leafNode.type) {
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
							//TODO: check here, that BDT-Nodes hand up their input correctly
							break;
						case GENERALDATATYPE_MODEL:
							let leafNodeID = leafNode.getID();
							let outputBPCfg: BlueprintConfig = otherIntrprtrCfgs[leafNodeID];
							let initialKvStores = null;
							if (!outputBPCfg) {
								let canInterpretType = (leafNode as ItptNodeModel).canInterpretType;
								let subItptOf = (leafNode as ItptNodeModel).subItptOf;
								let crudSkills = "cRud";
								let nameSelf = leafNodeID;
								initialKvStores = [];
								let interpretableKeysArr = [];
								outputBPCfg = outputBPCfg ? outputBPCfg : {
									subItptOf: subItptOf,
									canInterpretType: canInterpretType,
									nameSelf: nameSelf,
									initialKvStores: initialKvStores,
									crudSkills: crudSkills,
									interpretableKeys: interpretableKeysArr,
								};
								otherIntrprtrCfgs[leafNodeID] = outputBPCfg;
								this.fillBPCfgFromGraph(outputBPCfg, leafNode as ItptNodeModel, otherIntrprtrCfgs, topBPCfg);
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
							//extra handling so that the final output-class.subInterpretOf property and intererpretableKeys on subItpts
							if (branchNode.type === DECLARATION_MODEL && port.kv.key === UserDefDict.finalInputKey) {
								branchNode.subItptOf = leafNode.getID();
							} else {
								branchBPCfg.interpretableKeys.push(gdtKV.key);
							}
							break;
						case EXTENDABLETYPES_MODEL:
							let extendableNodeID = leafNode.getID();
							let extendableBPCfg: BlueprintConfig = otherIntrprtrCfgs[extendableNodeID];
							let extInitialKvStores = null;
							if (!extendableBPCfg) {
								let crudSkills = "cRud";
								let nameSelf = extendableNodeID;
								extInitialKvStores = [];
								let interpretableKeysArr = [];
								extendableBPCfg = extendableBPCfg ? extendableBPCfg : {
									subItptOf: COMP_BASE_CONTAINER,
									canInterpretType: UserDefDict.itptContainerObjType,
									nameSelf: nameSelf,
									initialKvStores: extInitialKvStores,
									crudSkills: crudSkills,
									interpretableKeys: interpretableKeysArr,
								};
								otherIntrprtrCfgs[extendableNodeID] = extendableBPCfg;
								this.fillBPCfgFromGraph(extendableBPCfg, leafNode as ItptNodeModel, otherIntrprtrCfgs, topBPCfg);
							} else {
								extInitialKvStores = extendableBPCfg.initialKvStores;
							}
							let extOutputType: string = leafPort.kv.ldType;
							let extPropRef = leafPort.kv.key === UserDefDict.exportSelfKey ? null : leafPort.kv.key;
							let extOutputRef: ObjectPropertyRef = {
								objRef: extendableNodeID,
								propRef: extPropRef
							};
							let extOutputKV: IKvStore = {
								key: leafPort.kv.key,
								value: extOutputRef,
								ldType: extOutputType
							};
							let extDtKV = this.composeKVs(extOutputKV, port.kv);
							branchBPCfg.initialKvStores.push(extDtKV);
							//extra handling so that the final output-class.subInterpretOf property and intererpretableKeys on subItpts
							if (branchNode.type === DECLARATION_MODEL && port.kv.key === UserDefDict.finalInputKey) {
								branchNode.subItptOf = leafNode.getID();
							} else {
								branchBPCfg.interpretableKeys.push(extDtKV.key);
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
		if (!isInputValueValidFor(sourceKV, targetKV))/*((sourceKV.ldType && targetKV.ldType) &&
			(sourceKV.ldType !== targetKV.ldType))*/ return targetKV;
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
			//intrprtrClass: sourceKV.intrprtrClass
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
					break;
				case UserDefDict.intrprtrNameKey:
					targetBP.nameSelf = kvStores[val].value;
					break;
				default:
					break;
			}
		});
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
