import { keys } from "lodash";

import { DesignerLogic, designerSpecificNodesColor } from "./designer-logic";
import { DefaultNodeModel, DefaultPortModel, DiagramWidget } from "storm-react-diagrams";
import { DesignerTray } from "./DesignerTray";
import { DesignerTrayItem } from "./DesignerTrayItem";
import { IItptInfoItem } from "defaults/DefaultitptRetriever";
import { BaseDataTypeNodeModel } from "./basedatatypes/BaseDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";
import { IBlueprintItpt, BlueprintConfig } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "./generaldatatypes/GeneralDataTypeNodeModel";
import * as appStyles from 'styles/styles.scss';
import { UserDefDict } from "ldaccess/UserDefDict";
import { DeclarationPartNodeModel } from "./declarationtypes/DeclarationNodeModel";
import { Component } from "react";
import { URLToMenuTree, treeDemoData } from "./URLsToMenuTree";
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";
import { RefMapDropSpace } from "./RefMapDropSpace";
import { LDError } from "appstate/LDError";
// import { value } from "../../../../node_modules/react-toolbox/lib/dropdown/theme.css";
import { generateItptFromCompInfo } from "../../generic/generatorFns";
import { Button } from "react-toolbox/lib/button";
import TreeView, { TreeViewProps, TreeViewState, TreeEntry } from 'metaexplorer-react-components/lib/treeview';
import { ITPT_TAG_ATOMIC, ITPT_TAG_COMPOUND } from "ldaccess/iitpt-retriever";

export interface DesignerBodyProps {
	logic: DesignerLogic;
}

export interface FlatContentInfo {
	flatContentURLs: string[];
	itpts: IBlueprintItpt[];
}

export interface DesignerBodyState { }

/**
 * @author Jonathan Schneider
 */
export class DesignerBody extends Component<DesignerBodyProps, DesignerBodyState> {
	constructor(props: DesignerBodyProps) {
		super(props);
		this.state = {};
	}

	public trayItemsFromItptList() {
		let itpts: IItptInfoItem[] = this.props.logic.getItptList();
		itpts.shift(); //rm basecontainer
		itpts.shift(); //rm refMap
		itpts.sort((a, b) => {
			var x = a.nameSelf.toLowerCase();
			var y = b.nameSelf.toLowerCase();
			if (x < y) { return -1; }
			if (x > y) { return 1; }
			return 0;
		});
		const specialNodesText: string = "Set standard values, mark a value for later input or build forms with as many interpreters as you want";
		const specialNodesTreeItem: TreeEntry = {
			flatContent: [
				<DesignerTrayItem key={1} model={{ type: "bdt" }} name="Simple Data Type" color={appStyles["$designer-secondary-color"]} />,
				<DesignerTrayItem key={2} model={{ type: "inputtype" }} name="External Input Marker" color={appStyles["$designer-secondary-color"]} />,
				<DesignerTrayItem key={3} model={{ type: "lineardata" }} name="Linear Data Display" color={appStyles["$designer-secondary-color"]} />
			],
			label: 'Special Nodes',
			subEntries: []
		};
		const atomicNodesText: string = "Use these elements to create compound nodes. As basic building blocks, they can't be split up into smaller parts";
		const atomicNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Atomic Nodes',
			subEntries: [],
			itpts: []
		};
		const compoundNodesText: string = "Combine any node type to make up new nodes, or drop one in the box below to see how it's been made";
		const compoundNodesTreeItem: TreeEntry & FlatContentInfo = {
			flatContentURLs: [],
			flatContent: [],
			label: 'Compound Nodes',
			subEntries: [],
			itpts: []
		};
		itpts.forEach((iItptInfoItm, idx) => {
			let ldBPCfg = (iItptInfoItm.itpt as IBlueprintItpt).cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			if (iItptInfoItm.tags.includes(ITPT_TAG_ATOMIC)) {
				this.addItptToTree(atomicNodesTreeItem, iItptInfoItm, trayName);
			} else
				if (iItptInfoItm.tags.includes(ITPT_TAG_COMPOUND)) {
					this.addItptToTree(compoundNodesTreeItem, iItptInfoItm, trayName);
				}
		});
		this.createFlatContentFromItpts(atomicNodesTreeItem);
		this.createFlatContentFromItpts(compoundNodesTreeItem);
		return <div style={{ paddingBottom: "40px", flex: 1 }} className="mdscrollbar">
			<TreeView entry={specialNodesTreeItem}>{specialNodesText}</TreeView>
			<TreeView entry={atomicNodesTreeItem}>{atomicNodesText}</TreeView>
			<TreeView entry={compoundNodesTreeItem}>{compoundNodesText}</TreeView>
		</div>;
	}

	render() {
		return (
			<div className="diagram-body">
				<DesignerTray>
					{this.trayItemsFromItptList()}
					<RefMapDropSpace
						dropText="drop here to load interpreter"
						refMapDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData("ld-node"));
							var nodesCount = keys(
								this.props.logic
									.getDiagramEngine()
									.getDiagramModel()
									.getNodes()
							).length;
							var node = null;
							switch (data.type) {
								case "ldbp":
									let itptInfo = this.props.logic.getItptList().find((itm) => itm.nameSelf === data.bpname);
									let itptCfg: BlueprintConfig = itptInfo.itpt.cfg;
									if (!itptCfg.initialKvStores
										|| itptCfg.initialKvStores.length !== 1
										|| itptCfg.initialKvStores[0].key !== UserDefDict.intrprtrBPCfgRefMapKey) {
										return { isSuccess: false, message: "interpreter is not a RefMap-Interpreter" };
									}
									this.props.logic.diagramFromItptBlueprint(itptCfg);

									this.props.logic.autoDistribute();
									this.forceUpdate();
									return { isSuccess: true, message: "check the diagram on the right to see your interpreter" };
								case "bdt":
									return { isSuccess: false, message: "simple data types can't be used here" };
								case "inputtype":
									return { isSuccess: false, message: "input type can't be used here" };
								case "lineardata":
									return { isSuccess: false, message: "linear data display can't be used here" };
								default:
									break;
							}
							return { isSuccess: false, message: JSON.stringify(data) };
							//throw new LDError("unsupported ");
							//return;
						}}
					/>
					<div className="button-row">
						<Button style={{ color: "white" }} label="zoom + autolayout" onClick={(ev) => {
							this.props.logic.autoDistribute();
							this.props.logic.getDiagramEngine().recalculatePortsVisually();
							this.forceUpdate();
						}
						} />
						<Button style={{ color: "white" }} label="clear" onClick={(ev) => {
							this.props.logic.clear();
						}} />
					</div>
				</DesignerTray>
				<div
					className="diagram-layer"
					onDrop={(event) => {
						var data = JSON.parse(event.dataTransfer.getData("ld-node"));
						var nodesCount = keys(
							this.props.logic
								.getDiagramEngine()
								.getDiagramModel()
								.getNodes()
						).length;

						var node = null;
						switch (data.type) {
							case "ldbp":
								let nodeName: string = "Node " + (nodesCount + 1) + ":";
								node = new GeneralDataTypeNodeModel(nodeName, null, null, "rgba(250,250,250,0.2)");
								if (data.bpname) {
									this.props.logic.addLDPortModelsToNodeFromItptRetr(node, data.bpname);
								}
								if (data.canInterpretType) node.canInterpretType = data.canInterpretType;
								break;
							case "bdt":
								var baseDataTypeKVStore: IKvStore = {
									key: UserDefDict.exportSelfKey,
									value: undefined,
									ldType: undefined
								};
								node = new BaseDataTypeNodeModel("Simple Data Type", null, null, "rgba(250,250,250,0.2)");
								node.addPort(new LDPortModel(false, "out-3", baseDataTypeKVStore, "output"));
								break;
							case "inputtype":
								var inputDataTypeKVStore: IKvStore = {
									key: UserDefDict.externalInput,
									value: undefined,
									ldType: undefined
								};
								node = new DeclarationPartNodeModel("External Input Marker", null, null, designerSpecificNodesColor);
								node.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
								break;
							case "lineardata":
								node = new ExtendableTypesNodeModel("Linear Data Display", null, null, designerSpecificNodesColor);
								let exportSelfKV: IKvStore = {
									key: UserDefDict.exportSelfKey,
									value: undefined,
									ldType: UserDefDict.intrprtrClassType
								};
								node.addPort(new LDPortModel(false, exportSelfKV.key, exportSelfKV));
								break;
							default:
								break;
						}
						var points = this.props.logic.getDiagramEngine().getRelativeMousePoint(event);
						node.x = points.x;
						node.y = points.y;
						this.props.logic
							.getDiagramEngine()
							.getDiagramModel()
							.addNode(node);
						this.forceUpdate();
					}}
					onDragOver={(event) => {
						event.preventDefault();
					}}
				>
					<DiagramWidget diagramEngine={this.props.logic.getDiagramEngine()} />
				</div>
			</div>
		);
	}

	private addItptToTree(tree: TreeEntry & FlatContentInfo, infoItm: IItptInfoItem, remainingName: string) {
		let remainerSplit = remainingName.split('/');
		let isCreateHere: boolean = false;
		if (remainerSplit.length === 1) {
			isCreateHere = true;
		}
		if (!isCreateHere) {
			let treeToAddToIdx: number = tree.subEntries.findIndex((val) => val.label === remainerSplit[0]);
			let treeToAddTo: TreeEntry = tree.subEntries[treeToAddToIdx];
			let remainerIdx: number = 1;
			if (!treeToAddTo) {
				treeToAddToIdx = tree.subEntries.findIndex((val, idx) => val.label.startsWith(remainerSplit[0]));
				treeToAddTo = tree.subEntries[treeToAddToIdx];
				if (treeToAddTo) {
					let searchTerm = remainerSplit[0];
					for (let idx = 1; idx < remainerSplit.length; idx++) {
						let newSearchTerm = searchTerm + '/' + remainerSplit[idx];
						remainerIdx = idx;
						if (!treeToAddTo.label.startsWith(newSearchTerm)) {
							break;
						}
						searchTerm = newSearchTerm;
					}
					if (treeToAddTo.label !== searchTerm) {
						let splitTreeLabelA = treeToAddTo.label.slice(searchTerm.length - 1);
						treeToAddTo.label = splitTreeLabelA;
						let newRoot: TreeEntry & FlatContentInfo = {
							flatContent: [],
							flatContentURLs: [],
							label: searchTerm,
							subEntries: [
								treeToAddTo
							],
							itpts: []
						};
						treeToAddTo = newRoot;
					}
				}
			}
			if (treeToAddTo) {
				remainerSplit = remainerSplit.slice(remainerIdx);
				tree.subEntries.splice(treeToAddToIdx, 1, treeToAddTo);
				this.addItptToTree(treeToAddTo as TreeEntry & FlatContentInfo, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (!isCreateHere) {
			let similarItm = tree.flatContentURLs.findIndex((val, idx) => val.startsWith(remainerSplit[0]));
			if (similarItm === -1) {
				isCreateHere = true;
			} else {
				let similarString: string = tree.flatContentURLs[similarItm];
				let stringRemainerIdx: number = 1;
				let searchTerm = remainerSplit[0];
				for (let idx = 1; idx < remainerSplit.length; idx++) {
					let newSearchTerm = searchTerm + '/' + remainerSplit[idx];
					stringRemainerIdx = idx;
					if (!similarString.startsWith(newSearchTerm)) {
						break;
					}
					searchTerm = newSearchTerm;
				}
				let remainerA = similarString.slice(searchTerm.length + 1);
				let newTree: TreeEntry & FlatContentInfo = {
					label: searchTerm,
					flatContentURLs: [remainerA],
					flatContent: [],
					subEntries: [],
					itpts: [tree.itpts[similarItm]]
				};
				remainerSplit = remainerSplit.slice(stringRemainerIdx);
				tree.subEntries.push(newTree);
				tree.itpts.splice(similarItm, 1);
				tree.flatContentURLs.splice(similarItm, 1);
				this.addItptToTree(newTree, infoItm, remainerSplit.join('/'));
				return;
			}
		}
		if (isCreateHere) {
			tree.flatContentURLs.push(remainingName);
			tree.itpts.push(infoItm.itpt);
		}
	}

	private createFlatContentFromItpts(tree: TreeEntry & FlatContentInfo) {
		tree.itpts.forEach((itpt, idx) => {
			let ldBPCfg = itpt.cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			let trayItptType = ldBPCfg ? ldBPCfg.canInterpretType : ldBPCfg.canInterpretType;
			let remainingName = tree.flatContentURLs[idx];
			tree.flatContent.push(<DesignerTrayItem key={trayName}
				model={{ type: "ldbp", bpname: trayName, canInterpretType: trayItptType, subItptOf: null }}
				name={remainingName}
				color={appStyles["$designer-secondary-color"]} />
			);
		});
		tree.subEntries.forEach((treeEntry: TreeEntry & FlatContentInfo, idx) => {
			this.createFlatContentFromItpts(treeEntry);
		});
	}
}
