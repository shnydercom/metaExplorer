import { COMP_BASE_CONTAINER } from "components/generic/baseContainer-rewrite";
import { IItptInfoItem, DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { ReduxItptRetriever } from "ld-react-redux-connect/ReduxItptRetriever";
import { IKvStore } from "ldaccess/ikvstore";
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from "ldaccess/kvConvenienceFns";
import { ldBaseDataTypeList } from "ldaccess/LDBaseDataType";
import { BlueprintConfig, IBlueprintItpt } from "ldaccess/ldBlueprint";
import { LDDict } from "ldaccess/LDDict";
import { isInputValueValidFor } from "ldaccess/ldtypesystem/typeChecking";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { ObjectPropertyRef, OBJECT_PROP_REF } from "ldaccess/ObjectPropertyRef";
import { UserDefDict } from "ldaccess/UserDefDict";
import { DefaultLinkModel, DiagramEngine, DiagramModel, NodeModel } from "storm-react-diagrams";
import { BaseDataTypeNodeFactory } from "./basedatatypes/BaseDataTypeInstanceFactories";
import { BaseDataTypeNodeModel } from "./basedatatypes/BaseDataTypeNodeModel";
import { distributeElements } from "./dagre-utils";
import { DeclarationPartNodeModel } from "./declarationtypes/DeclarationNodeModel";
import { DeclarationWidgetFactory } from "./declarationtypes/DeclarationNodeWidgetFactory";
import { BASEDATATYPE_MODEL, DECLARATION_MODEL, EXTENDABLETYPES_MODEL, GENERALDATATYPE_MODEL, OUTPUT_INFO_MODEL } from "./editor-consts";
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";
import { ExtendableTypesWidgetFactory } from "./extendabletypes/ExtendableTypesWidgetFactory";
import { GeneralDataTypeNodeFactory } from "./generaldatatypes/GeneralDataTypeInstanceFactories";
import { GeneralDataTypeNodeModel } from "./generaldatatypes/GeneralDataTypeNodeModel";
import { ItptNodeModel } from "./ItptNodeModel";
import { LDPortInstanceFactory } from "./LDPortInstanceFactory";
import { LDPortModel } from "./LDPortModel";
import { OutputInfoPartNodeModel, OUTPUT_NODE_WIDTH } from "./outputinfotypes/OutputInfoNodeModel";
import { OutputInfoWidgetFactory } from "./outputinfotypes/OutputInfoWidgetFactory";
import { SettingsLabelFactory } from "./SettingsLabelFactory";
import { SettingsLinkFactory } from "./SettingsLinkFactory";
import { appItptMatcherFn } from "appconfig/appItptMatcher";

export interface NewNodeSig {
	x: number;
	y: number;
	id: string;
}

export const DIAG_TRANSF_X = -250;
export const DIAG_TRANSF_Y = 200;
export const PORTNAME_OUT_OUTPUTSELF = "out-outputSelf";

export var editorSpecificNodesColor = "rgba(87, 161, 245, 0.4)";

export const editorDefaultNodesColor = "rgba(87, 161, 245, 0.4)"; // "#00375f";

/**
 * @author Jonathan Schneider
 */
export class EditorLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected itptList: IItptInfoItem[];
	protected outputNode: OutputInfoPartNodeModel;
	protected outputLDOptionsToken: string;
	protected onOutputInfoSaved: (itptName: string) => void;
	protected retrieverName: string = DEFAULT_ITPT_RETRIEVER_NAME;

	protected width: number = 300;
	protected height: number = 100;
	protected retriever: ReduxItptRetriever;
	/**
	 * userName of the currently logged in user, used for constructing new itptNames
	 */
	protected userName: string;
	/**
	 * project that the currently logged in user is editing, used for constructing new itptNames
	 */
	protected userProject: string;

	constructor(outputLDOptionsToken: string, retrieverName?: string, userName?: string, userProject?: string) {
		this.outputLDOptionsToken = outputLDOptionsToken;
		this.retrieverName = retrieverName;
		this.userName = userName;
		this.userProject = userProject;
		this.diagramEngine = new DiagramEngine();
		//label factories
		this.diagramEngine.registerLabelFactory(new SettingsLabelFactory());
		//link factories
		this.diagramEngine.registerLinkFactory(new SettingsLinkFactory());
		//node factories
		this.diagramEngine.registerNodeFactory(new BaseDataTypeNodeFactory());
		this.diagramEngine.registerNodeFactory(new GeneralDataTypeNodeFactory());
		this.diagramEngine.registerNodeFactory(new DeclarationWidgetFactory());
		this.diagramEngine.registerNodeFactory(new ExtendableTypesWidgetFactory());
		this.diagramEngine.registerNodeFactory(new OutputInfoWidgetFactory());
		//port factories
		this.diagramEngine.registerPortFactory(new LDPortInstanceFactory());
		this.newModel(outputLDOptionsToken);
		let retriever = appItptMatcherFn().getItptRetriever(this.retrieverName);
		if (!retriever) retriever = appItptMatcherFn().getItptRetriever(DEFAULT_ITPT_RETRIEVER_NAME);
		this.retriever = retriever as ReduxItptRetriever;
		this.itptList = retriever.getItptList();
		this.onOutputInfoSaved = (itptName: string) => {
			//
		};
	}

	public setDimensions(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public getOnOutputInfoSaved(): (itptName: string) => void {
		return this.onOutputInfoSaved;
	}
	public setOnOutputInfoSaved(value: (itptName: string) => void) {
		this.onOutputInfoSaved = value;
	}

	public clear() {
		this.newModel(this.outputLDOptionsToken);
	}

	public autoDistribute() {
		const engine = this.diagramEngine;
		const model = engine.getDiagramModel();
		let distributedModel = this.getDistributedModel(engine, model);
		this.activeModel = distributedModel;
		this.outputNode = this.activeModel.getNode(this.outputLDOptionsToken) as OutputInfoPartNodeModel;
		this.outputNode.width = OUTPUT_NODE_WIDTH;
		this.outputNode.addListener({
			outputInfoSaved: (evtVal) => {
				const newItpt = evtVal.itptName;
				this.onOutputInfoSaved(newItpt);
			}
		} as any);
		engine.setDiagramModel(distributedModel);
		engine.recalculatePortsVisually();
		let prevZoomlvl = distributedModel.getZoomLevel();
		if (engine.canvas) engine.zoomToFit();
		let newZoomLevel = distributedModel.getZoomLevel() * .8;
		const lowerBnd = prevZoomlvl * .79;
		const higherBnd = prevZoomlvl * .81;
		if (!(lowerBnd < newZoomLevel && newZoomLevel < higherBnd)) {
			distributedModel.setZoomLevel(newZoomLevel);
		}
		distributedModel.setOffsetX(this.width / 5);
	}

	public getDistributedModel(engine, model) {
		const serialized = model.serializeDiagram();
		const distributedSerializedDiagram = distributeElements(serialized);
		//deserialize the model
		let deSerializedModel = new DiagramModel();
		deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
		//bugfix for multiple labels:
		for (const key in deSerializedModel.links) {
			if (deSerializedModel.links.hasOwnProperty(key)) {
				const oneLink = deSerializedModel.links[key];
				if (oneLink.labels.length > 1) {
					oneLink.labels.pop();
				}
			}
		}
		return deSerializedModel;
	}

	public newModel(outputLDOptionsToken: string) {
		//2) setup the diagram model
		var model = new DiagramModel();

		//create fixed output node
		//TODO: make fixed but ports should still be settable, make outputNode singleton per Itpt
		let outputNode = new OutputInfoPartNodeModel(UserDefDict.outputItpt, null, null, editorSpecificNodesColor,
			outputLDOptionsToken, this.userName, this.userProject);
		//outputNode.setLocked(true); // locking would lock the ports as well
		const canvas = this.diagramEngine.canvas;
		if (canvas) {
			this.setDimensions(canvas.clientWidth, canvas.clientHeight);
		}
		outputNode.x = this.width / 2 - OUTPUT_NODE_WIDTH / 2;
		outputNode.y = this.height / 2 - OUTPUT_NODE_WIDTH / 2;
		outputNode.addListener({
			outputInfoSaved: (evtVal) => {
				const newItpt = evtVal.itptName;
				this.onOutputInfoSaved(newItpt);
			}
		} as any);

		let outputFinalInputKV: IKvStore = {
			key: UserDefDict.finalInputKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		let finalInputName: string = outputFinalInputKV.key;
		let outputNodeInputPort = new LDPortModel(true, finalInputName, outputFinalInputKV);
		outputNode.addPort(outputNodeInputPort);
		model.addNode(outputNode);
		//model.setOffsetX(this.width / 4);
		this.outputNode = outputNode;
		//5) load model into engine
		this.activeModel = model;
		this.diagramEngine.setDiagramModel(model);
		/*if (this.diagramEngine.canvas) {
			this.diagramEngine.zoomToFit();
		}*/
	}

	public getActiveModel(): DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}

	public refreshItptList(): void {
		this.itptList = this.retriever.getItptList();
	}

	public getItptList(): IItptInfoItem[] {
		this.refreshItptList();
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
		let itpt: IBlueprintItpt = this.retriever.getItptByNameSelf(bpname);
		let cfg: BlueprintConfig = itpt.cfg;
		this.addLDPortModelsToNodeFromCfg(node, cfg);
	}
	public addLDPortModelsToNodeFromCfg(node: ItptNodeModel, cfg: BlueprintConfig) {
		let rv: LDPortModel[] = [];
		let intrprtrKeys: any[] = cfg.interpretableKeys;
		let initialKvStores: IKvStore[] = cfg.initialKvStores;
		node.nameSelf = node.id;
		node.subItptOf = cfg.nameSelf;
		let numObjPropRef = 0;
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
						numObjPropRef++;
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
			//console.dir(node.getPorts());
			//rv.push(newLDPM);
		}
		//Itpt always exports itself
		let outputSelfKV: IKvStore = {
			key: UserDefDict.outputSelfKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		node.addPort(new LDPortModel(false, outputSelfKV.key, outputSelfKV));
		for (var j = intrprtrKeys.length - numObjPropRef; j < initialKvStores.length; j++) {
			//console.dir(node.getPorts());
			var elemj = initialKvStores[j];
			if (elemj.ldType === UserDefDict.intrprtrBPCfgRefMapType) continue;
			let nName: string = elemj.key + "_out";
			node.addPort(new LDPortModel(false, nName, elemj, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}

	public diagramFromItptBlueprint(itpt: BlueprintConfig): void {

		let refMap = getKVStoreByKey(itpt.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);

		let newX = this.outputNode.x + DIAG_TRANSF_X;
		let newY = this.outputNode.y + DIAG_TRANSF_Y;
		let newSigBaseItpt: NewNodeSig = { id: itpt.subItptOf, x: newX, y: newY - DIAG_TRANSF_Y };

		//create nodes first
		let nodeMap = new Map<string, GeneralDataTypeNodeModel>();
		let yIterator = 0;
		for (const itm in refMap.value) {
			if (refMap.value.hasOwnProperty(itm)) {
				const subItpt: BlueprintConfig = refMap.value[itm];
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
							sourcePort = sourceNode.getPort(UserDefDict.outputSelfKey) as LDPortModel;
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
						sourcePort = bdtStaticNode.getPort(PORTNAME_OUT_OUTPUTSELF) as LDPortModel;
					}
					let subItptLink = new DefaultLinkModel();
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
				let inputMarkerNode = new DeclarationPartNodeModel("External Input Marker", null, null, editorSpecificNodesColor);
				let inputMarkerPort = inputMarkerNode.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
				this.getDiagramEngine()
					.getDiagramModel()
					.addNode(inputMarkerNode);
				let targetNode = nodeMap.get(itptKeyField.objRef);
				let targetPort = targetNode.getPort(itptKeyField.propRef + "_in");
				let inputMarkerLink = new DefaultLinkModel();
				inputMarkerLink.setSourcePort(inputMarkerPort);
				inputMarkerLink.setTargetPort(targetPort);
				linkArray.push(inputMarkerLink);
			}
		}

		for (let outputKeysIdx = 0; outputKeysIdx < itpt.initialKvStores.length; outputKeysIdx++) {
			const outputElement = itpt.initialKvStores[outputKeysIdx];
			if (isObjPropertyRef(outputElement.value)) {
				let outputInfo: ObjectPropertyRef = outputElement.value as ObjectPropertyRef;
				let outputDataTypeKvStore: IKvStore = {
					key: UserDefDict.externalOutput,
					value: undefined,
					ldType: undefined
				};
				let outputMarkerNode = new DeclarationPartNodeModel("External Output Marker", null, null, editorSpecificNodesColor);
				let outputMarkerPort = outputMarkerNode.addPort(new LDPortModel(true, "in-4", outputDataTypeKvStore, UserDefDict.externalOutput));
				this.getDiagramEngine()
					.getDiagramModel()
					.addNode(outputMarkerNode);
				let targetNode = nodeMap.get(outputInfo.objRef);
				let targetPort = targetNode.getPort(outputInfo.propRef + "_out");
				let outputMarkerLink = new DefaultLinkModel();
				outputMarkerLink.setSourcePort(outputMarkerPort);
				outputMarkerLink.setTargetPort(targetPort);
				linkArray.push(outputMarkerLink);
			}
		}

		let baseNode = nodeMap.get(itpt.subItptOf);

		this.outputNode.setItptName(itpt.nameSelf);
		let outputNodeItptInPort = this.outputNode.getPort(UserDefDict.finalInputKey);

		let outputItptLink = new DefaultLinkModel();
		outputItptLink.setTargetPort(outputNodeItptInPort);
		outputItptLink.setSourcePort(baseNode.getPort(UserDefDict.outputSelfKey));

		this.getDiagramEngine().getDiagramModel().addLink(outputItptLink);
		this.getDiagramEngine().recalculatePortsVisually();
		linkArray.forEach((link) => {
			this.getDiagramEngine().getDiagramModel().addLink(link);
		});
	}

	public addNewExtendableNode(signature: NewNodeSig, itpt: BlueprintConfig): ExtendableTypesNodeModel {
		let extendableNode = new ExtendableTypesNodeModel("Linear Data Display", null, null, editorSpecificNodesColor);
		let nodeName: string = itpt.subItptOf;
		extendableNode.x = signature.x;
		extendableNode.y = signature.y;
		extendableNode.canInterpretType = itpt.canInterpretType;
		let outputSelfKV: IKvStore = {
			key: UserDefDict.outputSelfKey,
			value: undefined,
			ldType: UserDefDict.intrprtrClassType
		};
		this.addLDPortModelsToNodeFromCfg(extendableNode, itpt);
		extendableNode.id = signature.id;
		extendableNode.nameSelf = "Linear Data Display";
		this.getDiagramEngine()
			.getDiagramModel()
			.addNode(extendableNode);
		return extendableNode;
	}

	public addNewGeneralNode(signature: NewNodeSig, itpt: BlueprintConfig): GeneralDataTypeNodeModel {
		let nodeName: string = itpt.subItptOf;
		let generalNode = new GeneralDataTypeNodeModel(nodeName, null, null, editorDefaultNodesColor);
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
			key: UserDefDict.inputData,
			value: value,
			ldType: ldType
		};
		let node = new BaseDataTypeNodeModel("Simple Data Type", null, null, editorDefaultNodesColor);
		node.x = signature.x;
		node.y = signature.y;
		node.addPort(new LDPortModel(false, PORTNAME_OUT_OUTPUTSELF, baseDataTypeKVStore, "output", signature.id));
		this.getDiagramEngine()
			.getDiagramModel()
			.addNode(node);
		return node;
	}

	public intrprtrBlueprintFromDiagram(finalCanInterpretType?: string): BlueprintConfig {
		let rv: BlueprintConfig;
		if (!this.outputNode) return null;
		let crudSkills = "cRud";
		let subItptOf = null; //set later, relies on info from fillBPCfgFromGraph
		let nameSelf = this.outputNode.getItptName();
		let initialKvStores = [];
		let interpretableKeysArr = [];
		let canInterpretType = finalCanInterpretType ? finalCanInterpretType : null;
		let outputBPCfg: BlueprintConfig = {
			subItptOf,
			canInterpretType,
			nameSelf,
			initialKvStores,
			crudSkills,
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
		outputBPCfg.initialKvStores.unshift(intrprtMapKV);
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

		let outPorts: LDPortModel[] = branchNode.getOutPorts();
		outPorts.forEach((outport) => {
			let lso = outport.getLinksSortOrder();
			for (let index = 0; index < lso.length; index++) {
				const element = lso[index];
				/*let links = port.getLinks();
				for (const key in links) {
					if (links.hasOwnProperty(key)) {*/
				//const oneLink = links[key];
				const oneLink = outport.getLinks()[element];
				let leafNode: NodeModel = oneLink.getSourcePort().getParent();
				let leafPort: LDPortModel = oneLink.getSourcePort() as LDPortModel;
				if (!leafPort.in) {//leafNode.getID() === branchNode.getID()) {
					leafNode = oneLink.getTargetPort().getParent();
					leafPort = oneLink.getTargetPort() as LDPortModel;
				}
				switch (leafNode.type) {
					case DECLARATION_MODEL:
						let declarModel: DeclarationPartNodeModel = leafNode as DeclarationPartNodeModel;
						let declarID = declarModel.getID();
						if (leafPort.kv) {
							if (leafPort.kv.key === UserDefDict.externalOutput) {
								//is an external input marker
								let keyOutputMarked = outport.kv.key;
								let outputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyOutputMarked };
								//let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								//cfgIntrprtKeys.push(inputObjPropRef);
								let externalOutputKV = this.copyKV(outport.kv);
								externalOutputKV.value = outputObjPropRef;
								topBPCfg.initialKvStores.push(externalOutputKV);
								//branchBPCfg.interpretableKeys.push(port.kv.key);
							}
						}
					default: break;
				}
			}
		});
		let inPorts: LDPortModel[] = branchNode.getInPorts();
		inPorts.forEach((port) => {
			let lso = port.getLinksSortOrder();
			for (let index = 0; index < lso.length; index++) {
				const element = lso[index];
				/*let links = port.getLinks();
				for (const key in links) {
					if (links.hasOwnProperty(key)) {*/
				//const oneLink = links[key];
				const oneLink = port.getLinks()[element];
				let leafNode: NodeModel = oneLink.getSourcePort().getParent();
				let leafPort: LDPortModel = oneLink.getSourcePort() as LDPortModel;
				if (leafPort.in) {//leafNode.getID() === branchNode.getID()) {
					leafNode = oneLink.getTargetPort().getParent();
					leafPort = oneLink.getTargetPort() as LDPortModel;
				}
				switch (leafNode.type) {
					case DECLARATION_MODEL:
						let declarModel: DeclarationPartNodeModel = leafNode as DeclarationPartNodeModel;
						let declarID = declarModel.getID();
						if (leafPort.kv) {
							if (leafPort.kv.key === UserDefDict.externalInput) {
								//is an external input marker
								//is an external input marker
								let keyInputMarked = port.kv.key;
								let inputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyInputMarked };
								let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								cfgIntrprtKeys.push(inputObjPropRef);
								branchBPCfg.initialKvStores.push(this.copyKV(port.kv));
								branchBPCfg.interpretableKeys.push(port.kv.key);
							}
							if (leafPort.kv.key === UserDefDict.externalOutput) {
								let keyOutputMarked = port.kv.key;
								let outputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyOutputMarked };
								let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								cfgIntrprtKeys.push(outputObjPropRef);
								branchBPCfg.initialKvStores.push(this.copyKV(port.kv));
								branchBPCfg.interpretableKeys.push(port.kv.key);
							}
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
						let propRef = leafPort.kv.key === UserDefDict.outputSelfKey ? null : leafPort.kv.key;
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
						if (branchNode.type === OUTPUT_INFO_MODEL && port.kv.key === UserDefDict.finalInputKey) {
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
						let extPropRef = leafPort.kv.key === UserDefDict.outputSelfKey ? null : leafPort.kv.key;
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
						if (branchNode.type === OUTPUT_INFO_MODEL && port.kv.key === UserDefDict.finalInputKey) {
							branchNode.subItptOf = leafNode.getID();
						} else {
							branchBPCfg.interpretableKeys.push(extDtKV.key);
						}
						break;
					default:
						break;
				}
				//}
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
					default:
						break;
				}
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
		//console.dir(idxMap);
	}
}
