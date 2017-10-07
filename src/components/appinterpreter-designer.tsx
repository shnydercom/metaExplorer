import * as _ from "lodash";
import * as React from "react";
import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget
} from "storm-react-diagrams";
import { BaseDataTypeWidgetFactory } from "./appinterpreter-parts/BaseDataTypeWidgetFactory";
import { BaseDataTypeNodeModel } from './appinterpreter-parts/BaseDataTypeNodeModel';
import { LDPortModel } from './appinterpreter-parts/LDPortModel';

//console.log('lodash version:', _.toUpper("abcDE"));
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());
	engine.registerNodeFactory(new BaseDataTypeWidgetFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	var newNode1 = new BaseDataTypeNodeModel("interpreter", "rgb(60,60,60)");
	var newPort1 = newNode1.addPort(new LDPortModel(true, "out-3", "someLabel"));
	newNode1.x = 100;
	newNode1.y = 200;
	model.addNode(newNode1);

	//3-A) create a default node
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;

	//3-B) create another default node
	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
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
	model.addLink(linkNew);

	//5) load model into engine
	engine.setDiagramModel(model);

	var test = _.map(model.getNodes());

	//6) render the diagram!
	return <div className="entrypoint-editor" >
		<DiagramWidget diagramEngine={engine} />
	</div>;
};
