import { keys } from "lodash";

import { EditorLogic, editorSpecificNodesColor } from "./editor-logic";
import { DiagramWidget } from "storm-react-diagrams";
import { BaseDataTypeNodeModel } from "./basedatatypes/BaseDataTypeNodeModel";
import { LDPortModel } from "./LDPortModel";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "./generaldatatypes/GeneralDataTypeNodeModel";
import { UserDefDict } from "ldaccess/UserDefDict";
import { DeclarationPartNodeModel } from "./declarationtypes/DeclarationNodeModel";
import { Component } from "react";
import { ExtendableTypesNodeModel } from "./extendabletypes/ExtendableTypesNodeModel";
import { RefMapDropSpace, DropRefmapResult } from "./RefMapDropSpace";

export interface EditorBodyProps {
	logic: EditorLogic;
	currentlyEditingItpt: string | null;
	changeCurrentlyEditingItpt: (newItpt: string | null) => void;
	onEditTrayItem: (data: any) => DropRefmapResult;
	loadToEditorByName: (name: string, isDoAutodistribute?: boolean) => void;
	hideRefMapDropSpace: boolean;
}

export interface EditorBodyState {
	currentlyEditingItpt: string | null;
	isReloadToEditor: boolean;
}

/**
 * @author Jonathan Schneider
 */
export class EditorBody extends Component<EditorBodyProps, EditorBodyState> {

	static getDerivedStateFromProps(nextProps: EditorBodyProps, prevState: EditorBodyState): EditorBodyState | null {
		if (nextProps.currentlyEditingItpt !== prevState.currentlyEditingItpt) {
			let nextCurEditItpt = nextProps.currentlyEditingItpt;
			return { currentlyEditingItpt: nextCurEditItpt, isReloadToEditor: true };
		}
		return null;
	}

	private privOnRMDrop = this.onRefMapDrop.bind(this);
	constructor(props: EditorBodyProps) {
		super(props);
		this.state = { currentlyEditingItpt: null, isReloadToEditor: false };
	}

	componentDidUpdate(nextProps: EditorBodyProps) {
		const { currentlyEditingItpt, isReloadToEditor } = this.state;
		if (!isReloadToEditor && currentlyEditingItpt) {
			if (currentlyEditingItpt) {
				nextProps.logic.clear();
				nextProps.loadToEditorByName(currentlyEditingItpt, true);
				this.setState({ ...this.state, isReloadToEditor: false });
			}
		}
	}

	onRefMapDrop(event: DragEvent) {
		var data = JSON.parse(event.dataTransfer.getData("ld-node"));
		event.stopPropagation();
		return this.props.onEditTrayItem(data);
	}

	render() {
		const { logic, hideRefMapDropSpace } = this.props;
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
								node = new DeclarationPartNodeModel("External Input Marker", null, null, editorSpecificNodesColor);
								node.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
								break;
							case "outputtype":
								var outputDataTypeKVStore: IKvStore = {
									key: UserDefDict.externalOutput,
									value: undefined,
									ldType: undefined
								};
								node = new DeclarationPartNodeModel("External Output Marker", null, null, editorSpecificNodesColor);
								node.addPort(new LDPortModel(true, "in-4", outputDataTypeKVStore, UserDefDict.externalOutput));
								break;
							case "lineardata":
								node = new ExtendableTypesNodeModel("Linear Data Display", null, null, editorSpecificNodesColor);
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
					<DiagramWidget inverseZoom diagramEngine={this.props.logic.getDiagramEngine()} maxNumberPointsPerLink={0} />
					{hideRefMapDropSpace
						? null
						: <div className="button-row">
							<RefMapDropSpace
								currentlyEditingItpt={this.state.currentlyEditingItpt}
								dropText="...drop a Compound Block here to edit it, or long-press on it, then hit the 'INTERPRET' button in the middle..."
								refMapDrop={this.privOnRMDrop}
							/>
						</div>
					}
				</div>
			</div>
		);
	}
}
