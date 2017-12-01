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
import Button from 'react-toolbox/lib/button';
//import "storm-react-diagrams/dist/style.css";

import { BaseDataTypeWidgetFactory } from "./appinterpreter-parts/BaseDataTypeWidgetFactory";
import { BaseDataTypeNodeModel } from './appinterpreter-parts/BaseDataTypeNodeModel';

import { LDPortModel } from './appinterpreter-parts/LDPortModel';
import { GeneralDataTypeWidgetFactory } from "components/appinterpreter-parts/GeneralDataTypeWidgetFactory";
import { DesignerBody } from "components/appinterpreter-parts/DesignerBody";
import { DesignerLogic } from "components/appinterpreter-parts/designer-logic";
import { GenericContainer } from "components/generic/genericContainer-component";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { BooleanValInput } from "components/basedatatypeinterpreter/BaseDataTypeInput";

export type AIDProps = {
	logic?: DesignerLogic;
};

export type AIDState = {
	serialized: string;
};

//console.log('lodash version:', _.toUpper("abcDE"));
export default class AppInterpreterDesigner extends React.Component<AIDProps, AIDState> {

	logic: DesignerLogic;
	constructor(props: AIDProps) {
		super(props);
		this.state = {serialized: ""};
		if (!props) {
			props = {};
		}
		if (!props.logic){
			var logic: DesignerLogic = new DesignerLogic();
			this.logic = logic;
		}else{
			this.logic = props.logic;
		}
	}

	onTestBtnClick = (e) => {
		e.preventDefault();
		let nodesBPCFG = this.logic.intrprtrBlueprintFromDiagram();
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		//nodesSerialized = JSON.stringify(this.logic.getDiagramEngine().getDiagramModel().serializeDiagram(), undefined, 2);
		this.setState({serialized : nodesSerialized});
	}
	render() {
		return <div className="entrypoint-editor">
			<Splitter className={s.splitter}
				position="vertical"
				primaryPaneMaxWidth="80%"
				primaryPaneMinWidth="40%"
				primaryPaneWidth="50%"
				dispatchResize={true}
				postPoned={false}
				primaryPaneHeight="100%"
			>
				<DesignerBody logic={this.logic} />
				<div className="vertical-scroll">
					<Button onClick={this.onTestBtnClick}>serialize!</Button>
					<GenericContainer ldTokenString="" displayedType="shnyder/ProductDisplay" searchCrudSkills="cRud" />
					<BooleanValInput singleKV={null} ldTokenString="thisCouldBeaGenericToken"/>
					<small><pre>{this.state.serialized}</pre></small>
				</div>
			</Splitter>
		</div >;
	}
}
