import * as _ from "lodash";
import * as React from "react";
import * as redux from 'redux';
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
import { GenericContainer, LDConnectedState, LDOwnProps } from "components/generic/genericContainer-component";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { BooleanValInput } from "components/basedatatypeinterpreter/BaseDataTypeInput";
import { connect } from "react-redux";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";

export type AIDProps = {
	logic?: DesignerLogic;
} & LDOwnProps;

export type AIDState = {
	serialized: string;
};

export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: AIDProps) => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: AIDProps & LDOwnProps & AIDState): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ldOptions) {
			let kvStores: IKvStore[] = [{
				key: undefined,
				ldType: undefined,
				value: ownProps.serialized
			}];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});

//console.log('lodash version:', _.toUpper("abcDE"));
class PureAppInterpreterDesigner extends React.Component<AIDProps & LDConnectedState & LDConnectedDispatch, AIDState> {

	logic: DesignerLogic;
	constructor(props?: any) {
		super(props);
		this.state = { serialized: "" };
		if (!props) {
			props = { ldTokenString: "myTokenString" };
		}
		if (!props.logic) {
			var logic: DesignerLogic = new DesignerLogic();
			this.logic = logic;
		} else {
			this.logic = props.logic;
		}
	}

	componentWillMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	onTestBtnClick = (e) => {
		e.preventDefault();
		let nodesBPCFG = this.logic.intrprtrBlueprintFromDiagram();
		this.logic.addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		this.props.ldOptions.resource.kvStores = [{ key: nodesBPCFG.forType, ldType: undefined, value: nodesSerialized }];
		//let nodesSerialized = JSON.stringify(this.logic.getDiagramEngine().getDiagramModel().serializeDiagram(), undefined, 2);
		this.setState({ serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(this.props.ldOptions);
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
					<GenericContainer ldTokenString={this.state.serialized} displayedType="test" searchCrudSkills="cRud" />
					<BooleanValInput singleKV={null} ldTokenString="thisCouldBeaGenericToken" />
					<small><pre>{this.state.serialized}</pre></small>
				</div>
			</Splitter>
		</div >;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PureAppInterpreterDesigner);
