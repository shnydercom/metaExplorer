import * as _ from "lodash";
import * as React from "react";
import Splitter from 'm-react-splitters';
import * as s from 'm-react-splitters/lib/splitters.css';
import * as appStyles from 'styles/styles.scss';
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
//import "storm-react-diagrams/dist/style.css";

import { BaseDataTypeWidgetFactory } from "./appinterpreter-parts/BaseDataTypeWidgetFactory";
import { BaseDataTypeNodeModel } from './appinterpreter-parts/BaseDataTypeNodeModel';

import { LDPortModel } from './appinterpreter-parts/LDPortModel';
import { GeneralDataTypeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidgetFactory";
import { DesignerBody } from "components/appinterpreter-parts/DesignerBody";
import { DesignerLogic } from "components/appinterpreter-parts/designer-logic";
import { GenericContainer } from "components/generic/genericContainer-component";

//console.log('lodash version:', _.toUpper("abcDE"));
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());
	engine.registerNodeFactory(new BaseDataTypeWidgetFactory());
	engine.registerNodeFactory(new GeneralDataTypeWidgetFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	var newNode1 = new BaseDataTypeNodeModel("Simple Data Type", "rgb(250,60,60)");
	var newPort1 = newNode1.addPort(new LDPortModel(false, "out-3", "someLabel"));
	newNode1.x = 100;
	newNode1.y = 200;
	model.addNode(newNode1);

	console.log("newNode1:");
	console.dir(newNode1);
	console.log("newPort1:");
	console.dir(newPort1);

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

	//var test = _.map(model.getNodes());
	var logic: DesignerLogic = new DesignerLogic();
	//6) render the diagram!
	return <div className="entrypoint-editor" >
		<Splitter className={s.splitter}
			position="vertical"
			primaryPaneMaxWidth="80%"
			primaryPaneMinWidth="40%"
			primaryPaneWidth="50%"
			dispatchResize={true}
			postPoned={false}
			primaryPaneHeight="100%"
		>
			<DesignerBody logic={logic} />
			<GenericContainer class={appStyles} demoType="shnyder/ProductDisplay" searchCrudSkills="CrUd" />
		</Splitter>
	</div>;
};
