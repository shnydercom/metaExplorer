import { Component } from "react";
import Splitter from 'm-react-splitters';
import * as s from 'm-react-splitters/lib/splitters.css';

import AppBar from 'react-toolbox/lib/app_bar/AppBar.js';

import configuratorTestData from '../../../testing/configuratorTestData';
import * as prefilledProductItptA from '../../../testing/prefilledProductInterpreter.json';
import * as prefilledOrganizationItptA from '../../../testing/prefilledOrganizationInterpreter.json';

import * as linearDataDisplayTest from '../../../testing/linearDataDisplayTest.json';

import { ComponentClass, StatelessComponent } from 'react';

//YWQD
import * as prefilledMDBottomNav from '../../../testing/prefilledYWQDBottomNav.json';
import * as prefilledScndStepA from '../../../testing/prefilledScndStepA.json';
import * as prefilledScndStepAA from '../../../testing/prefilledScndStepAA.json';
import * as barcodePrefilled from '../../../testing/barcodeScanner.json';
import * as prefilledSingleImageSel from '../../../testing/prefilledSingleImageSel.json';
import * as prefilledYWQDApp from '../../../testing/ywqd-app.json';

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
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
//import "storm-react-diagrams/dist/style.css";

import { BaseDataTypeWidgetFactory } from "./parts/basedatatypes/BaseDataTypeWidgetFactory";
import { BaseDataTypeNodeModel } from './parts/basedatatypes/BaseDataTypeNodeModel';

import { LDPortModel } from './parts/LDPortModel';
import { GeneralDataTypeWidgetFactory } from "./parts/generaldatatypes/GeneralDataTypeWidgetFactory";
import { DesignerBody } from "./parts/DesignerBody";
import { DesignerLogic } from "./parts/designer-logic";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { connect } from "react-redux";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { LDDict } from "ldaccess/LDDict";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "appstate/LDProps";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { designerTheme } from "styles/designer/designerTheme";
import { appTheme } from "styles/appTheme/appTheme";
import { LDConsts } from "ldaccess/LDConsts";
import NavBarWActions from "components/md/navigation/NavBarWActions";
import BottomNavigation from "components/md/navigation/BottomNavigation";

import {
	Route,
	Link
} from 'react-router-dom';
import ImgHeadSubDescIntrprtr from "components/visualcomposition/ImgHeadSubDescIntrprtr";
import { Switch, withRouter, RouteComponentProps } from "react-router";
import { BaseContainerRewrite } from "../generic/baseContainer-rewrite";

export type AIDProps = {
	logic?: DesignerLogic;
} & LDOwnProps;

export type AIDState = {
	serialized: string;
	previewerToken: string;
};

const DESIGNER_KV_KEY = "DesignerKvKey";

class PureAppItptDesigner extends Component<AIDProps & LDConnectedState & LDConnectedDispatch & LDOwnProps, AIDState> {
	finalCanInterpretType: string = LDDict.ViewAction; // what type the itpt you're designing is capable of interpreting -> usually a new generic type
	logic: DesignerLogic;
	errorNotAvailableMsg: string = "Itpt Designer environment not available. Please check your settings";
	constructor(props?: any) {
		super(props);
		let previewerToken = null;
		previewerToken = props.ldTokenString + "-previewLDOptions";
		if (!props.logic) {
			var logic: DesignerLogic = new DesignerLogic(props.ldTokenString);
			this.logic = logic;
		} else {
			this.logic = props.logic;
		}
		this.state = { serialized: "", previewerToken: previewerToken };
	}

	componentWillMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	onSerializeBtnClick = (e) => {
		e.preventDefault();
		let nodesBPCFG: BlueprintConfig = this.logic.intrprtrBlueprintFromDiagram(null);
		let newType = nodesBPCFG.canInterpretType;
		if (!newType) {
			if (!nodesBPCFG.nameSelf) return;
			newType = nodesBPCFG.nameSelf + UserDefDict.standardItptObjectTypeSuffix;
			nodesBPCFG.canInterpretType = newType;
		}
		let dummyInstance = this.logic.intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		this.logic.addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: DESIGNER_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	// tslint:disable-next-line:member-ordering
	hascreatedFirst: boolean = false;
	onGenAppClick = (e) => {
		if (!this.hascreatedFirst) {
			let prefilledData: any = prefilledMDBottomNav;
			this.generatePrefilled(prefilledData);
		}
		let prefilledScnd: any = prefilledScndStepA;
		this.generatePrefilled(prefilledScnd);
	}

	onGenBarcodeClick = (e) => {
		let prefilledData: any = barcodePrefilled;
		this.generatePrefilled(prefilledData);
	}

	onGenSingleImageSel = (e) => {
		if (!this.hascreatedFirst) {
			let prefilledDataA: any = prefilledMDBottomNav;
			this.generatePrefilled(prefilledDataA);
		}
		let prefilledDataB: any = prefilledSingleImageSel;
		this.generatePrefilled(prefilledDataB);
	}

	onYWQDClick = (e) => {
		if (!this.hascreatedFirst) {
			let prefilledDataA: any = prefilledMDBottomNav;
			this.generatePrefilled(prefilledDataA);
		}
		let prefilledDataB: any = prefilledYWQDApp;
		this.generatePrefilled(prefilledDataB);
	}

	onGenLinearClick = (e) => {
		let prefilledData: any = linearDataDisplayTest;
		this.generatePrefilled(prefilledData);
	}

	generatePrefilled = (input: any) => {
		let nodesBPCFG: BlueprintConfig = input as BlueprintConfig;
		let dummyInstance = this.logic.intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		this.logic.addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: DESIGNER_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}
	onMultiConfiguratorButtonClick = (e) => {
		this.props.notifyLDOptionsChange(null);
		let prefilledData: IKvStore[] = configuratorTestData;
		let newType = "configuratorType";
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = prefilledData;
		this.setState({ ...this.state, serialized: "" });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onPrefilledProductButtonClick = (e) => {
		let prefilledData: any = prefilledProductItptA;
		let nodesBPCFG: BlueprintConfig = prefilledData as BlueprintConfig;
		let dummyInstance = this.logic.intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		this.logic.addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: DESIGNER_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onPrefilledOrganizationButtonClick = (e) => {
		let prefilledData: any = prefilledOrganizationItptA;
		let nodesBPCFG: BlueprintConfig = prefilledData as BlueprintConfig;
		let dummyInstance = this.logic.intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		this.logic.addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: DESIGNER_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onIncreaseIDButtonClick = (e) => {
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		let kvChangeVar = newLDOptions.resource.kvStores.find((val) => val.ldType && val.ldType.endsWith(UserDefDict.standardItptObjectTypeSuffix));
		if (!kvChangeVar || !kvChangeVar.value) return;
		kvChangeVar.value.identifier = kvChangeVar.value.identifier !== null ? kvChangeVar.value.identifier + 1 : 0;
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	render() {
		if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
			return <div>{this.errorNotAvailableMsg}</div>;
		}
		return <div className="entrypoint-editor">
			<Splitter className={s.splitter}
				position="vertical"
				primaryPaneMaxWidth="80%"
				primaryPaneMinWidth="40%"
				primaryPaneWidth="43%"
				dispatchResize={true}
				postPoned={false}
				primaryPaneHeight="100%"
			>
				<ThemeProvider theme={designerTheme}>
					<DesignerBody logic={this.logic} />
				</ThemeProvider>
				<div className="vertical-scroll">
					<Button onClick={this.onSerializeBtnClick}>serialize!</Button>
					<Button onClick={this.onGenAppClick}>Generate App!</Button>
					<Button onClick={this.onGenSingleImageSel}>My Barcodes App</Button>
					<Button onClick={this.onYWQDClick}>愿望清单</Button>
					<Button onClick={this.onGenBarcodeClick}>Barcode Scanner</Button>
					<Button onClick={this.onIncreaseIDButtonClick}>increaseID!</Button>
					<Button onClick={this.onPrefilledProductButtonClick}>Product!</Button>
					<Button onClick={this.onPrefilledOrganizationButtonClick}>Organization</Button>
					<Button onClick={this.onMultiConfiguratorButtonClick}>configuratorTest!</Button>

					<Button onClick={this.onGenLinearClick}>Linear!</Button>
					<Link to="/designerinitial">initial   </Link>
					<Link to="/app">   app</Link>
					<ThemeProvider theme={appTheme}>
						<div className="app-preview">
							<div className="app-content">
								<Switch>
									<Route path="/designerinitial" render={() => (
										<div><b>drag and drop items into the designer</b></div>
									)} />
									<Route path="/app" render={(routeProps: LDRouteProps) => {
										routeProps.match.params.nextPath = "app";
										return <>
											<BaseContainerRewrite routes={routeProps} ldTokenString={this.props.ldTokenString} searchCrudSkills="cRud" />
										</>;
									}} />
								</Switch>
							</div>
						</div>
					</ThemeProvider>
					<p>demo image link: http://localhost:3000/dist/static/localhost.png</p>
					<small><pre className="designer-json">{this.state.serialized}</pre></small>
				</div>
			</Splitter>
		</div >;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PureAppItptDesigner);
