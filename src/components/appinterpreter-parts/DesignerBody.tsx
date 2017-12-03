import * as React from "react";
import * as _ from "lodash";

import { DesignerLogic, designerSpecificNodesColor } from "components/appinterpreter-parts/designer-logic";
import { DefaultNodeModel, DefaultPortModel, DiagramWidget } from "storm-react-diagrams";
import { DesignerTray } from "components/appinterpreter-parts/DesignerTray";
import { DesignerTrayItem } from "components/appinterpreter-parts/DesignerTrayItem";
import { IInterpreterInfoItem } from "defaults/DefaultInterpreterRetriever";
import { BaseDataTypeNodeModel } from "components/appinterpreter-parts/BaseDataTypeNodeModel";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { IBlueprintInterpreter } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { GeneralDataTypeNodeModel } from "components/appinterpreter-parts/GeneralDataTypeNodeModel";
import * as appStyles from 'styles/styles.scss';
import { UserDefDict } from "ldaccess/UserDefDict";
import { DeclarationPartNodeModel } from "components/appinterpreter-parts/DeclarationNodeModel";

export interface DesignerBodyProps {
	logic: DesignerLogic;
}

export interface DesignerBodyState { }

/**
 * @author Dylan Vorster
 */
export class DesignerBody extends React.Component<DesignerBodyProps, DesignerBodyState> {
	constructor(props: DesignerBodyProps) {
		super(props);
		this.state = {};
	}

	public trayItemsFromInterpreterList() {
		//let reactCompClasses: React.ComponentClass[] = [];
		let interpreters: IInterpreterInfoItem[] = this.props.logic.getInterpreterList();
		interpreters.splice(1, 0, null);
		//console.dir(interpreters);
		let reactCompClasses: JSX.Element[] = interpreters.map((itm, idx) => {
			//let GenericComp = itm;
			if (idx === 0) {
				return <DesignerTrayItem key={idx} model={{ type: "bdt" }} name="Simple Data Type" color={appStyles["$designer-secondary-color"]} />;
			}
			if (idx === 1) {
				return <DesignerTrayItem key={idx} model={{ type: "inputtype" }} name="External Input Marker" color={appStyles["$designer-secondary-color"]} />;
			}
			//console.dir(ports);
			let ldBPCfg = (itm.interpreter as IBlueprintInterpreter).cfg;
			let trayName = ldBPCfg ? ldBPCfg.nameSelf : "unnamed";
			let trayType = ldBPCfg ? ldBPCfg.forType : itm.type;
			return <DesignerTrayItem key={idx} model={{ type: "ldbp", bpname: trayName, bptype: trayType }} name={trayName} color={appStyles["$designer-secondary-color"]} />;
		});
		return reactCompClasses;
	}

	render() {
		return (
			<div className="diagram-body">
				<DesignerTray>
					{this.trayItemsFromInterpreterList()}
					{/* <DesignerTrayItem model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
					<DesignerTrayItem model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" /> */}
				</DesignerTray>
				<div
					className="diagram-layer"
					onDrop={(event) => {
						console.dir(event);
						var data = JSON.parse(event.dataTransfer.getData("ld-node"));
						var nodesCount = _.keys(
							this.props.logic
								.getDiagramEngine()
								.getDiagramModel()
								.getNodes()
						).length;

						var node = null;
						switch (data.type) {
							case "ldbp":
								let nodeName: string = "Node " + (nodesCount + 1) + ":";
								node = new GeneralDataTypeNodeModel(nodeName, null, "rgba(250,250,250,0.2)");
								console.dir(data);
								console.dir(node);
								if (data.bpname) {
									this.props.logic.addLDPortModelsToNode(node, data.bpname);
									/*let newPorts: LDPortModel[] = data.ports as LDPortModel[];
									console.log("test1");
									console.dir(newPorts);
									for (var index = 0; index < newPorts.length; index++) {
										console.log(index +"index");
										var element: LDPortModel = newPorts[index];
										element.parentNode = node;
										node.addPort(element);
										//node.addPort(new LDPortModel(true, "test", "test" + "-out"));
									}*/
								}
								if (data.bptype) node.forType = data.bptype;
								console.dir(node);
								break;
							case "bdt":
								var baseDataTypeKVStore: IKvStore = {
									key: UserDefDict.exportSelfKey,
									value: undefined,
									ldType: undefined
								};
								node = new BaseDataTypeNodeModel("Simple Data Type", null, "rgba(250,250,250,0.2)");
								node.addPort(new LDPortModel(false, "out-3", baseDataTypeKVStore, "output"));
								break;
							case "inputtype":
								var inputDataTypeKVStore: IKvStore = {
									key: UserDefDict.externalInput,
									value: undefined,
									ldType: undefined
								};
								node = new DeclarationPartNodeModel("External Input Marker", null, designerSpecificNodesColor);
								node.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
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
}
