import * as React from "react";
import * as _ from "lodash";

import { DesignerLogic } from "components/appinterpreter-parts/designer-logic";
import { DefaultNodeModel, DefaultPortModel, DiagramWidget } from "storm-react-diagrams";
import { DesignerTray } from "components/appinterpreter-parts/DesignerTray";
import { DesignerTrayItem } from "components/appinterpreter-parts/DesignerTrayItem";

export interface DesignerBodyProps {
	logic: DesignerLogic;
}

export interface DesignerBodyState {}

/**
 * @author Dylan Vorster
 */
export class DesignerBody extends React.Component<DesignerBodyProps, DesignerBodyState> {
	constructor(props: DesignerBodyProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
				<div className="designer-content">
					<DesignerTray>
						<DesignerTrayItem model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
						<DesignerTrayItem model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
					</DesignerTray>
					<div
						className="diagram-layer"
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
							var nodesCount = _.keys(
								this.props.logic
									.getDiagramEngine()
									.getDiagramModel()
									.getNodes()
							).length;

							var node = null;
							if (data.type === "in") {
								node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(192,255,0)");
								node.addPort(new DefaultPortModel(true, "in-1", "In"));
							} else {
								node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
								node.addPort(new DefaultPortModel(false, "out-1", "Out"));
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
