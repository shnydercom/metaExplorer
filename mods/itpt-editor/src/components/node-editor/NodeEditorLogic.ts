import {
	COMP_BASE_CONTAINER, IItptInfoItem, DEFAULT_ITPT_RETRIEVER_NAME, ReduxItptRetriever, getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg,
	ldBaseDataTypeList, BlueprintConfig, IBlueprintItpt, LDDict, IKvStore, isInputValueValidFor, isObjPropertyRef,
	ObjectPropertyRef, UserDefDict, appItptMatcherFn
} from "@metaexplorer/core";
import createEngine, { DiagramEngine, DiagramModel, NodeModel, LinkModel, LinkModelGenerics, DagreEngine } from "@projectstorm/react-diagrams";
import { ItptNodeModel } from "./_super/ItptNodeModel";
import { LDPortModel } from "./_super/LDPortModel";
import { BaseDataTypeNodeModel } from "./basedatatypes/BaseDataTypeNodeModel";
import { DeclarationPartNodeModel } from "./declarationtypes/DeclarationNodeModel";
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";
import { OutputInfoPartNodeModel, OUTPUT_NODE_WIDTH } from "./outputinfotypes/OutputInfoNodeModel";
import { GeneralDataTypeNodeModel, GeneralDataTypeNodeModelListener } from "./generaldatatypes/GeneralDataTypeNodeModel";
import { BaseDataTypeNodeFactory } from "./basedatatypes/BaseDataTypeInstanceFactories";
import { DeclarationWidgetFactory } from "./declarationtypes/DeclarationNodeWidgetFactory";
import { ExtendableTypesWidgetFactory } from "./extendabletypes/ExtendableTypesWidgetFactory";
import { GeneralDataTypeNodeFactory } from "./generaldatatypes/GeneralDataTypeInstanceFactories";
import { LDPortInstanceFactory } from "./_super/LDPortInstanceFactory";
import { OutputInfoWidgetFactory } from "./outputinfotypes/OutputInfoWidgetFactory";
import { SettingsLabelFactory } from "./edgesettings/SettingsLabelFactory";
import { SettingsLinkFactory } from "./edgesettings/SettingsLinkFactory";
import { BASEDATATYPE_MODEL, DECLARATION_MODEL, EXTENDABLETYPES_MODEL, GENERALDATATYPE_MODEL, OUTPUT_INFO_MODEL, LINK_SETTINGS_MODEL } from "./node-editor-consts";
import { ZoomCanvasAction } from "@projectstorm/react-canvas-core";
import { DIAG_TRANSF_X, DIAG_TRANSF_Y, PORTNAME_OUT_OUTPUTSELF } from "./consts";

export interface NewNodeSig {
	x: number;
	y: number;
	id: string;
}

/**
 * @author Jonathan Schneider
 */
export class NodeEditorLogic {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;
	protected dagreEngine: DagreEngine;
	protected itptList: IItptInfoItem[];
	protected outputNode: OutputInfoPartNodeModel;
	protected outputLDOptionsToken: string;
	protected onOutputInfoSaved: (itptName: string) => void;
	protected onExploreTriggered: (itptName: string) => void;
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
		this.diagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });
		this.dagreEngine = new DagreEngine({
			graph: {
				rankdir: 'LR',
				ranker: 'longest-path',
				marginx: 25,
				marginy: 25
			},
			includeLinks: true
		});
		//new DiagramEngine();

		this.diagramEngine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		//label factories
		this.diagramEngine.getLabelFactories().registerFactory(new SettingsLabelFactory());
		//link factories
		this.diagramEngine.getLinkFactories().registerFactory(new SettingsLinkFactory());
		//node factories
		this.diagramEngine.getNodeFactories().registerFactory(new BaseDataTypeNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new GeneralDataTypeNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new DeclarationWidgetFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new ExtendableTypesWidgetFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new OutputInfoWidgetFactory());
		//port factories
		this.diagramEngine.getPortFactories().registerFactory(new LDPortInstanceFactory());
		this.newModel(outputLDOptionsToken);
		let retriever = appItptMatcherFn().getItptRetriever(this.retrieverName);
		if (!retriever) retriever = appItptMatcherFn().getItptRetriever(DEFAULT_ITPT_RETRIEVER_NAME);
		this.retriever = retriever as ReduxItptRetriever;
		this.itptList = retriever.getItptList();
		this.onOutputInfoSaved = (itptName: string) => {
			//
		};
		this.onExploreTriggered = (itptName: string) => {
			//
		};
	}

	public setDimensions(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public getOnExploreTriggered(): (itptName: string) => void {
		return this.onExploreTriggered;
	}
	public setOnExploreTriggered(value: (itptName: string) => void) {
		this.onExploreTriggered = value;
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
		const model = engine.getModel();
		this.dagreEngine.redistribute(model);
		engine.zoomToFitNodes();
		model.setZoomLevel(model.getZoomLevel() * .8);
		model.setOffsetX(this.width / 5);
		model.setOffsetY(32);
	}

	public newModel(outputLDOptionsToken: string) {
		var model = new DiagramModel();

		//create fixed output node
		//TODO: make fixed but ports should still be settable, make outputNode singleton per Itpt
		let outputNode = new OutputInfoPartNodeModel({
			nameSelf: UserDefDict.outputItpt,
			itptName: null,
			itptUserName: this.userName,
			itptProjName: this.userProject,
			itptBlockName: "",
			id: outputLDOptionsToken
		});
		const canvas = this.diagramEngine.getCanvas();
		if (canvas) {
			this.setDimensions(canvas.clientWidth, canvas.clientHeight);
		}
		const outputNodex = this.width / 2 - OUTPUT_NODE_WIDTH / 2;
		const outputNodey = this.height / 2 - OUTPUT_NODE_WIDTH / 2;
		outputNode.setPosition(outputNodex, outputNodey);
		outputNode.registerListener({
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
		let outputNodeInputPort = LDPortModel.fromVars(true, finalInputName, outputFinalInputKV, finalInputName);
		outputNode.addPort(outputNodeInputPort);
		model.addNode(outputNode);
		this.outputNode = outputNode;
		// load model into engine
		this.activeModel = model;
		this.addListenersToModel(model);
		this.diagramEngine.setModel(model);
	}

	addListenersToNode(node: NodeModel) {
		node.registerListener({
			entityRemoved: (event) => {
				this.onOutputInfoSaved(this.outputNode.getItptName());
			}
		});
		if (node.getType() === GENERALDATATYPE_MODEL) {
			if ((node as GeneralDataTypeNodeModel).getIsCompound()) {
				node.registerListener({
					onTriggerExplore: (ev) => {
						this.onExploreTriggered(ev.itptName);
					}
				} as GeneralDataTypeNodeModelListener);
			}
		}
	}

	addListenersToLink(link: LinkModel<LinkModelGenerics>) {
		link.registerListener({
			sourcePortChanged: (ev) => {
				this.onOutputInfoSaved(this.outputNode.getItptName());
			},
			targetPortChanged: (ev) => {
				this.onOutputInfoSaved(this.outputNode.getItptName());
			}
		});
	}

	addListenersToModel(model: DiagramModel) {
		model.registerListener({
			nodesUpdated: (event) => {
				this.onOutputInfoSaved(this.outputNode.getItptName());
			},
			linksUpdated: (event) => {
				this.addListenersToLink(event.link);
				this.onOutputInfoSaved(this.outputNode.getItptName());
			}
		});
		const nodesMap = model.getNodes();
		for (const key in nodesMap) {
			if (nodesMap.hasOwnProperty(key)) {
				const node = nodesMap[key];
				this.addListenersToNode(node);
			}
		}
		const linksMap = model.getLinks();
		for (const linkKey in linksMap) {
			if (linksMap.hasOwnProperty(linkKey)) {
				const link = linksMap[linkKey];
				this.addListenersToLink(link);
			}
		}
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
			//let firstBTIfound: boolean = false;
			for (var index = 0; index < ldBaseDataTypeList.length; index++) {
				var element = ldBaseDataTypeList[index];
				if (itm.baseType === element) {
					if (!baseTypeIntrprtr) baseTypeIntrprtr = itm;
					//firstBTIfound = true;
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
		//let rv: LDPortModel[] = [];
		let intrprtrKeys: any[] = cfg.interpretableKeys;
		let initialKvStores: IKvStore[] = cfg.initialKvStores;
		node.setNameSelf(node.getID());
		node.setSubItptOf(cfg.nameSelf);
		node.setIsCompound(!!cfg.subItptOf);
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
				node.addPort(LDPortModel.fromVars(true, nName, elemi, elemi.key));
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
					node.addPort(LDPortModel.fromVars(true, nestedName, elemiNested, nestedKey));
				}
				else if (elemi.ldType === UserDefDict.intrprtrClassType) {
					let newInKV: IKvStore = {
						key: elemi.key,
						value: undefined,
						ldType: UserDefDict.intrprtrClassType
					};
					node.addPort(LDPortModel.fromVars(true, elemi.key + "_in", newInKV, elemi.key));
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
		node.addPort(LDPortModel.fromVars(false, outputSelfKV.key, outputSelfKV, outputSelfKV.key));
		for (var j = intrprtrKeys.length - numObjPropRef; j < initialKvStores.length; j++) {
			//console.dir(node.getPorts());
			var elemj = initialKvStores[j];
			if (elemj.ldType === UserDefDict.intrprtrBPCfgRefMapType) continue;
			let nName: string = elemj.key + "_out";
			node.addPort(LDPortModel.fromVars(false, nName, elemj, elemj.key));
			//let newLDPM: LDPortModel = new LDPortModel(false, elemj.key, elemj.key + "-out");
			//rv.push(newLDPM);
		}
		//return rv;
	}

	public diagramFromItptBlueprint(itpt: BlueprintConfig): void {

		let refMap = getKVStoreByKey(itpt.initialKvStores, UserDefDict.intrprtrBPCfgRefMapKey);

		let newX = this.outputNode.getX() + DIAG_TRANSF_X;
		let newY = this.outputNode.getY() + DIAG_TRANSF_Y;
		let newSigBaseItpt: NewNodeSig = { id: itpt.subItptOf, x: newX, y: newY - DIAG_TRANSF_Y };

		//create nodes first
		let nodeMap = new Map<string, GeneralDataTypeNodeModel | ExtendableTypesNodeModel>();
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
						let newBDTid: string = `${itm}-bdt${idx}`;
						let newBDTSig: NewNodeSig = { id: newBDTid, x: newSigBaseItpt.x + DIAG_TRANSF_X, y: newSigBaseItpt.y - DIAG_TRANSF_Y * idx };
						if (!kvItm.ldType || kvItm.ldType === LDDict.Text) {
							bdtStaticNode = this.addNewBDTNode(newBDTSig, LDDict.Text, kvItm.value);
						} else {
							bdtStaticNode = this.addNewBDTNode(newBDTSig, kvItm.ldType, kvItm.value);
						}
						sourcePort = bdtStaticNode.getPort(PORTNAME_OUT_OUTPUTSELF) as LDPortModel;
					}
					let subItptLink = this.diagramEngine.getLinkFactories().getFactory(LINK_SETTINGS_MODEL).generateModel({});
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
				let inputMarkerNode = new DeclarationPartNodeModel({ nameSelf: "External Input Marker" });
				let inputMarkerPort = inputMarkerNode.addPort(LDPortModel.fromVars(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
				this.getDiagramEngine()
					.getModel()
					.addNode(inputMarkerNode);
				let targetNode = nodeMap.get(itptKeyField.objRef);
				let targetPort = targetNode.getPort(itptKeyField.propRef + "_in");
				let inputMarkerLink = this.diagramEngine.getLinkFactories().getFactory(LINK_SETTINGS_MODEL).generateModel({});
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
				let outputMarkerNode = new DeclarationPartNodeModel({ nameSelf: "External Output Marker" });
				let outputMarkerPort = outputMarkerNode.addPort(LDPortModel.fromVars(true, "in-4", outputDataTypeKvStore, UserDefDict.externalOutput));
				this.getDiagramEngine()
					.getModel()
					.addNode(outputMarkerNode);
				let targetNode = nodeMap.get(outputInfo.objRef);
				let targetPort = targetNode.getPort(outputInfo.propRef + "_out");
				let outputMarkerLink = this.diagramEngine.getLinkFactories().getFactory(LINK_SETTINGS_MODEL).generateModel({});
				outputMarkerLink.setSourcePort(outputMarkerPort);
				outputMarkerLink.setTargetPort(targetPort);
				linkArray.push(outputMarkerLink);
			}
		}

		let baseNode = nodeMap.get(itpt.subItptOf);

		this.outputNode.setItptName(itpt.nameSelf);
		let outputNodeItptInPort = this.outputNode.getPort(UserDefDict.finalInputKey);

		let outputItptLink = this.diagramEngine.getLinkFactories().getFactory(LINK_SETTINGS_MODEL).generateModel({});
		outputItptLink.setTargetPort(outputNodeItptInPort);
		outputItptLink.setSourcePort(baseNode.getPort(UserDefDict.outputSelfKey));

		this.getDiagramEngine().getModel().addLink(outputItptLink);
		linkArray.forEach((link) => {
			this.getDiagramEngine().getModel().addLink(link);
		});
	}

	public addNewExtendableNode(signature: NewNodeSig, itpt: BlueprintConfig): ExtendableTypesNodeModel {
		let extendableNode = new ExtendableTypesNodeModel({ id: signature.id, nameSelf: "Linear Data Display" });
		const extendableNodex = signature.x;
		const extendableNodey = signature.y;
		extendableNode.setPosition(extendableNodex, extendableNodey);
		extendableNode.setCanInterpretType(itpt.canInterpretType);
		this.addLDPortModelsToNodeFromCfg(extendableNode, itpt);
		extendableNode.setNameSelf("Linear Data Display");
		this.addListenersToNode(extendableNode);
		this.getDiagramEngine()
			.getModel()
			.addNode(extendableNode);
		return extendableNode;
	}

	public addNewGeneralNode(signature: NewNodeSig, itpt: BlueprintConfig): GeneralDataTypeNodeModel {
		let nodeName: string = itpt.subItptOf;
		let generalNode = new GeneralDataTypeNodeModel({ id: signature.id, nameSelf: nodeName });
		const generalNodex = signature.x;
		const generalNodey = signature.y;
		generalNode.setPosition(generalNodex, generalNodey);
		this.addLDPortModelsToNodeFromItptRetr(generalNode, nodeName);
		if (itpt.canInterpretType) generalNode.setCanInterpretType(itpt.canInterpretType);
		this.addListenersToNode(generalNode);
		this.getDiagramEngine()
			.getModel()
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
			key: UserDefDict.outputData,
			value: value,
			ldType: ldType
		};
		let node = new BaseDataTypeNodeModel({ nameSelf: "Simple Data Type" });
		const nodex = signature.x;
		const nodey = signature.y;
		node.setPosition(nodex, nodey);
		//const newPort = LDPortModel.fromVars(false, PORTNAME_OUT_OUTPUTSELF, baseDataTypeKVStore, "output");
		const newPort = new LDPortModel({ id: signature.id, in: false, name: PORTNAME_OUT_OUTPUTSELF, kv: baseDataTypeKVStore, label: "output" });
		node.addPort(newPort);
		this.addListenersToNode(node);
		this.getDiagramEngine()
			.getModel()
			.addNode(node);
		return node;
	}

	public intrprtrBlueprintFromDiagram(finalCanInterpretType?: string): BlueprintConfig {
		//let rv: BlueprintConfig;
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
		outputBPCfg.subItptOf = this.outputNode.getSubItptOf();
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
				if (!leafPort.isIn()) {//leafNode.getID() === branchNode.getID()) {
					if (!oneLink.getTargetPort()) continue;
					leafNode = oneLink.getTargetPort().getParent();
					leafPort = oneLink.getTargetPort() as LDPortModel;
				}
				switch (leafNode.getType()) {
					case DECLARATION_MODEL:
						//let declarModel: DeclarationPartNodeModel = leafNode as DeclarationPartNodeModel;
						//let declarID = declarModel.getID();
						if (leafPort.getKV()) {
							if (leafPort.getKV().key === UserDefDict.externalOutput) {
								//is an external input marker
								let keyOutputMarked = outport.getKV().key;
								let outputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyOutputMarked };
								//let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								//cfgIntrprtKeys.push(inputObjPropRef);
								let externalOutputKV = this.copyKV(outport.getKV());
								externalOutputKV.value = outputObjPropRef;
								topBPCfg.initialKvStores.push(externalOutputKV);
								//branchBPCfg.interpretableKeys.push(port.getKV().key);
							}
						}
						break;
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
				if (leafPort.isIn()) {//leafNode.getID() === branchNode.getID()) {
					if (!oneLink.getTargetPort()) continue;
					leafNode = oneLink.getTargetPort().getParent();
					leafPort = oneLink.getTargetPort() as LDPortModel;
				}
				switch (leafNode.getType()) {
					case DECLARATION_MODEL:
						//let declarModel: DeclarationPartNodeModel = leafNode as DeclarationPartNodeModel;
						//let declarID = declarModel.getID();
						if (leafPort.getKV()) {
							if (leafPort.getKV().key === UserDefDict.externalInput) {
								//is an external input marker
								//is an external input marker
								let keyInputMarked = port.getKV().key;
								let inputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyInputMarked };
								let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								cfgIntrprtKeys.push(inputObjPropRef);
								branchBPCfg.initialKvStores.push(this.copyKV(port.getKV()));
								branchBPCfg.interpretableKeys.push(port.getKV().key);
							}
							if (leafPort.getKV().key === UserDefDict.externalOutput) {
								let keyOutputMarked = port.getKV().key;
								let outputObjPropRef: ObjectPropertyRef = { objRef: branchNode.getID(), propRef: keyOutputMarked };
								let cfgIntrprtKeys: (string | ObjectPropertyRef)[] = topBPCfg.interpretableKeys;
								cfgIntrprtKeys.push(outputObjPropRef);
								branchBPCfg.initialKvStores.push(this.copyKV(port.getKV()));
								branchBPCfg.interpretableKeys.push(port.getKV().key);
							}
						}
						break;
					case BASEDATATYPE_MODEL:
						let bdtLeafNode: BaseDataTypeNodeModel = leafNode as BaseDataTypeNodeModel;
						let bdtKV = this.composeKVs(bdtLeafNode.getOutPorts()[0].getKV(), port.getKV());
						branchBPCfg.initialKvStores.push(bdtKV);
						//TODO: check here, that BDT-Nodes hand up their input correctly
						break;
					case GENERALDATATYPE_MODEL:
						let leafNodeID = leafNode.getID();
						let outputBPCfg: BlueprintConfig = otherIntrprtrCfgs[leafNodeID];
						let initialKvStores = null;
						if (!outputBPCfg) {
							let canInterpretType = (leafNode as ItptNodeModel).getCanInterpretType();
							let subItptOf = (leafNode as ItptNodeModel).getSubItptOf();
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
						let outputType: string = leafPort.getKV().ldType;
						let propRef = leafPort.getKV().key === UserDefDict.outputSelfKey ? null : leafPort.getKV().key;
						let outputRef: ObjectPropertyRef = {
							objRef: leafNodeID,
							propRef: propRef
						};
						let outputKV: IKvStore = {
							key: leafPort.getKV().key,
							value: outputRef,
							ldType: outputType
						};
						let gdtKV = this.composeKVs(outputKV, port.getKV());
						branchBPCfg.initialKvStores.push(gdtKV);
						//extra handling so that the final output-class.subInterpretOf property and intererpretableKeys on subItpts
						if (branchNode.getType() === OUTPUT_INFO_MODEL && port.getKV().key === UserDefDict.finalInputKey) {
							branchNode.setSubItptOf(leafNode.getID());
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
						let extOutputType: string = leafPort.getKV().ldType;
						let extPropRef = leafPort.getKV().key === UserDefDict.outputSelfKey ? null : leafPort.getKV().key;
						let extOutputRef: ObjectPropertyRef = {
							objRef: extendableNodeID,
							propRef: extPropRef
						};
						let extOutputKV: IKvStore = {
							key: leafPort.getKV().key,
							value: extOutputRef,
							ldType: extOutputType
						};
						let extDtKV = this.composeKVs(extOutputKV, port.getKV());
						branchBPCfg.initialKvStores.push(extDtKV);
						//extra handling so that the final output-class.subInterpretOf property and intererpretableKeys on subItpts
						if (branchNode.getType() === OUTPUT_INFO_MODEL && port.getKV().key === UserDefDict.finalInputKey) {
							branchNode.setSubItptOf(leafNode.getID());
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

	/*private copyKVforExport(sourceKV: IKvStore): IKvStore {
		let newKVStore: IKvStore = this.copyKV(sourceKV);
		if (newKVStore.value && newKVStore.value.hasOwnProperty(OBJECT_PROP_REF)) {
			(sourceKV.value as ObjectPropertyRef).propRef = null;
		}
		return newKVStore;
	}*/

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
		//let lastVal = 0;
		idxMap.forEach((val, key) => {
			kvStores.splice(val, 1);
			idxMap.forEach((val2, key2) => {
				if (val2 > val) idxMap.set(key2, val2 - 1);
			});
		});
		//console.dir(idxMap);
	}
}
