import { keys } from "lodash";

import { DesignerLogic, designerSpecificNodesColor } from "./designer-logic";
import { DiagramWidget } from "storm-react-diagrams";
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
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";
import { RefMapDropSpace, DropRefmapResult } from "./RefMapDropSpace";
import { Button } from "react-toolbox/lib/button";
import TreeView, { TreeEntry, TreeViewProps, TreeViewState } from 'metaexplorer-react-components/lib/components/treeview/treeview';
import { ITPT_TAG_ATOMIC, ITPT_TAG_COMPOUND } from "ldaccess/iitpt-retriever";

export interface DesignerBodyProps {
	logic: DesignerLogic;
	currentlyEditingItpt: string | null;
	changeCurrentlyEditingItpt: (newItpt: string | null) => void;
	onEditTrayItem: (data: any) => DropRefmapResult;
	loadToDesignerByName: (name: string) => void;
}

export interface DesignerBodyState {
	currentlyEditingItpt: string | null;
}

/**
 * @author Jonathan Schneider
 */
export class DesignerBody extends Component<DesignerBodyProps, DesignerBodyState> {

	static getDerivedStateFromProps(nextProps: DesignerBodyProps, prevState: DesignerBodyState) {
		if (nextProps.currentlyEditingItpt !== prevState.currentlyEditingItpt) {
			let nextCurEditItpt = nextProps.currentlyEditingItpt;
			if (nextCurEditItpt) {
				nextProps.logic.clear();
				nextProps.loadToDesignerByName(nextCurEditItpt);
			}
			return { currentlyEditingItpt: nextCurEditItpt };
		}
		return null;
	}

	private privOnRMDrop = this.onRefMapDrop.bind(this);
	constructor(props: DesignerBodyProps) {
		super(props);
		this.state = { currentlyEditingItpt: null };
	}

	onRefMapDrop(event) {
		var data = JSON.parse(event.dataTransfer.getData("ld-node"));
		return this.props.onEditTrayItem(data);
	}

	render() {
		return (
			<div className="diagram-body">
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
							case "outputtype":
								var outputDataTypeKVStore: IKvStore = {
									key: UserDefDict.externalOutput,
									value: undefined,
									ldType: undefined
								};
								node = new DeclarationPartNodeModel("External Output Marker", null, null, designerSpecificNodesColor);
								node.addPort(new LDPortModel(true, "in-4", outputDataTypeKVStore, UserDefDict.externalOutput));
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
					<DiagramWidget inverseZoom diagramEngine={this.props.logic.getDiagramEngine()} />
					<div className="button-row">
						<RefMapDropSpace
							currentlyEditingItpt={this.state.currentlyEditingItpt}
							dropText="...drop a Compound Block here to edit it, or long-press on it, then hit the 'INTERPRET' button in the middle..."
							refMapDrop={this.privOnRMDrop}
						/>
					</div>
				</div>
			</div>
		);
	}
}
