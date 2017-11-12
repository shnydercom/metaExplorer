import * as React from "react";
import * as _ from "lodash";

import { DesignerLogic } from "components/appinterpreter-parts/designer-logic";
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
		//console.dir(interpreters);
		let reactCompClasses: JSX.Element[] = interpreters.map((itm, idx) => {
			//let GenericComp = itm;
			if (idx === 0) {
				return <DesignerTrayItem key={idx} model={{ type: "bdt" }} name="Simple Data Type" color="rgb(192,100,0)" />;
			}
			//console.dir(ports);
			let ldBPCfg = (itm.interpreter as IBlueprintInterpreter).cfg;
			return <DesignerTrayItem key={idx} model={{ type: "ldbp", bpname: ldBPCfg ? ldBPCfg.nameSelf : "unnamed" }} name={itm.type} color="rgb(192,255,0)" />;
		});
		return reactCompClasses;
	}

	render() {
		return (
			<div>
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
								node = new GeneralDataTypeNodeModel(nodeName, "rgb(192,255,0)");
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
								console.dir(node);
								break;
							case "bdt":
								node = new BaseDataTypeNodeModel("Simple Data Type", "rgb(192,100,0)");
								node.addPort(new LDPortModel(false, "out-3", "output"));
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
