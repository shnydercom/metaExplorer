import { Component } from "react";
import Splitter from 'm-react-splitters';
import * as s from 'm-react-splitters/lib/splitters.css';

import configuratorTestData from '../../../testing/configuratorTestData';
import * as prefilledProductItptA from '../../../testing/prefilledProductInterpreter.json';
import * as prefilledOrganizationItptA from '../../../testing/prefilledOrganizationInterpreter.json';

import * as linearDataDisplayTest from '../../../testing/linearDataDisplayTest.json';
import * as linearDataDisplayTest2_Inner from '../../../testing/linearDataDisplayTest2_inner.json';

import { ComponentClass, StatelessComponent } from 'react';

//Game
import * as prefilledGame from '../../../testing/gamescreen.json';

//YWQD
import * as prefilledScndStepA from '../../../testing/prefilledScndStepA.json';
import * as barcodePrefilled from '../../../testing/barcodeScanner.json';
import * as prefilledSingleImageSel from '../../../testing/prefilledSingleImageSel.json';
import * as prefilledYWQDApp from '../../../testing/ywqd-app.json';

//demo

import * as fourIconBottomBar from '../../../demos/four-icon-bottombar.json';
import * as testImage from '../../../demos/test-image.json';
import * as singleChoiceGame from '../../../demos/single-choice-game.json';
import * as actionPanel from '../../../demos/actionpanel.json';
import * as barcodeScanPanel from '../../../demos/camerascanpanel.json';
import * as expenseFormPanel from '../../../demos/expense-form-panel.json';
import * as bookingFormPanel from '../../../demos/booking-form-panel.json';

import * as bookingBuyFlight from '../../../demos/booking-flight-summary.json';
import * as bookingBuyTrain from '../../../demos/booking-train-summary.json';
import * as bookingBuyBus from '../../../demos/booking-bus-summary.json';

import * as bookingSelectionTrain from '../../../demos/booking-sel-train.json';
import * as bookingSelectionFlight from '../../../demos/booking-sel-flight.json';
import * as bookingSelectionBus from '../../../demos/booking-sel-bus.json';
import * as bookingSelectionPanel from '../../../demos/booking-selection-panel.json';
import * as timetrackingPanel from '../../../demos/timetracking-form-panel.json';
import * as mainScreen from '../../../demos/main-screen.json';
import * as gameScreen from '../../../demos/game-screen.json';
import * as searchScreen from '../../../demos/search-screen.json';
import * as expenseScreen from '../../../demos/expense-screen.json';
import * as timeTrackingScreen from '../../../demos/timetracking-screen.json';
import * as bookingScreen from '../../../demos/booking-screen.json';
import * as appMain from '../../../demos/app-main.json';
import * as routehowto from '../../../demos/route-howto.json';
import * as htmlhowto from '../../../demos/html-howto.json';

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
import "storm-react-diagrams/dist/style.min.css";
import { DesignerBody } from "./parts/DesignerBody";
import { DesignerLogic } from "./parts/designer-logic";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { connect } from "react-redux";
import { LDDict } from "ldaccess/LDDict";
import { BlueprintConfig } from "ldaccess/ldBlueprint";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "appstate/LDProps";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { designerTheme } from "styles/designer/designerTheme";
import { appTheme } from "styles/appTheme/appTheme";

import {
	Route,
	Link
} from 'react-router-dom';
import { Switch } from "react-router";
import { BaseContainerRewrite } from "../generic/baseContainer-rewrite";
import { Tabs, Tab } from "react-toolbox/lib/tabs";
import { FontIcon } from "react-toolbox/lib/font_icon";

export type AIDProps = {
	logic?: DesignerLogic;
} & LDOwnProps;

export type AIDState = {
	serialized: string;
	previewerToken: string;
	previewDisplay: "phone" | "code";
	hasCompletedFirstRender: boolean;
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
		this.state = { serialized: "", previewerToken: previewerToken, previewDisplay: "phone", hasCompletedFirstRender: false };
	}

	componentDidMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	onInterpretBtnClick = (e) => {
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
		let blankLDOptions = ldOptionsDeepCopy(newLDOptions);
		blankLDOptions.resource.kvStores = [];
		this.props.notifyLDOptionsChange(blankLDOptions);
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	// tslint:disable-next-line:member-ordering
	hascreatedFirst: boolean = false;
	onGenAppClick = (e) => {
		if (!this.hascreatedFirst) {
			let prefilledData: any = fourIconBottomBar;
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
			let prefilledDataA: any = fourIconBottomBar;
			this.generatePrefilled(prefilledDataA);
		}
		let prefilledDataB: any = prefilledSingleImageSel;
		this.generatePrefilled(prefilledDataB);
	}

	onYWQDClick = (e) => {
		if (!this.hascreatedFirst) {
			let prefilledDataA: any = fourIconBottomBar;
			this.generatePrefilled(prefilledDataA);
		}
		let prefilledDataB: any = prefilledYWQDApp;
		this.generatePrefilled(prefilledDataB);
	}

	onGenLinearClick = (e) => {
		let prefilledData: any = linearDataDisplayTest2_Inner;
		this.generatePrefilled(prefilledData);
	}

	onGameClick = (e) => {
		let prefilledData: any = prefilledGame;
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

	componentDidUpdate(prevProps: AIDProps & LDConnectedState & LDConnectedDispatch & LDOwnProps) {
		if (!this.state.hasCompletedFirstRender) {
			//generate demos for compound itpts
			let prefilledData: any[] = [fourIconBottomBar, testImage, singleChoiceGame,
				actionPanel, barcodeScanPanel, expenseFormPanel, timetrackingPanel, bookingFormPanel, bookingSelectionPanel,
				bookingSelectionFlight, bookingSelectionTrain, bookingSelectionBus,
				bookingBuyFlight,	bookingBuyTrain, bookingBuyBus,
				mainScreen, searchScreen, expenseScreen, gameScreen, timeTrackingScreen, bookingScreen,
				routehowto, htmlhowto, appMain
			];
			for (let i = 0; i < prefilledData.length; i++) {
				this.generatePrefilled(prefilledData[i]);
			}
			this.setState({ ...this.state, hasCompletedFirstRender: true });
		}
	}
	render() {
		if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
			return <div>{this.errorNotAvailableMsg}</div>;
		}
		let isDisplayDevContent = false;
		return <div className="entrypoint-editor">
			<Splitter className={s.splitter}
				position="vertical"
				primaryPaneMaxWidth="80%"
				primaryPaneMinWidth="40%"
				primaryPaneWidth="66%"
				dispatchResize={true}
				postPoned={false}
				primaryPaneHeight="100%"
			>
				<ThemeProvider theme={designerTheme}>
					<DesignerBody logic={this.logic} />
				</ThemeProvider>
				<div className="phone-preview-container">
					{isDisplayDevContent ? <>
						<Button onClick={this.onInterpretBtnClick}>interpret!</Button>
						<Button onClick={this.onGenAppClick}>Generate App!</Button>
						<Button onClick={this.onGenSingleImageSel}>My Barcodes App</Button>
						<Button onClick={this.onYWQDClick}>愿望清单</Button>
						<Button onClick={this.onGenBarcodeClick}>Barcode Scanner</Button>
						<Button onClick={this.onIncreaseIDButtonClick}>increaseID!</Button>
						<Button onClick={this.onPrefilledProductButtonClick}>Product!</Button>
						<Button onClick={this.onPrefilledOrganizationButtonClick}>Organization</Button>
						<Button onClick={this.onMultiConfiguratorButtonClick}>configuratorTest!</Button>

						<Button onClick={this.onGenLinearClick}>Linear!</Button>
						<Button onClick={this.onGameClick}>Game!</Button>
						<Link to="/designerinitial">initial   </Link>
						<Link to="/app">   app</Link>
					</> : null}
					<div className="rotated-serialize">
						<Button onClick={this.onInterpretBtnClick} raised primary style={{ background: '#010f27' }}>
							<FontIcon value='arrow_upward' />
							-
							Interpret
							-
							<FontIcon value='arrow_upward' />
						</Button>
					</div>
					<div className="phone-preview-centered vertical-scroll">
						{this.state.previewDisplay === "phone" ?
							<ThemeProvider theme={appTheme}>
								<div className="app-preview">
									<div className="app-content">
										<Switch>
											<Route path="/designerinitial" render={() => (
												<div><b>drag and drop items into the designer</b></div>
											)} />
											<Route path="/" render={(routeProps: LDRouteProps) => {
												//routeProps.match.params.nextPath = "/";
												return <>
													<BaseContainerRewrite routes={routeProps} ldTokenString={this.props.ldTokenString} searchCrudSkills="cRud" />
												</>;
											}} />
										</Switch>
									</div>
								</div>
							</ThemeProvider>
							:
							<div className="code-preview">
								<h4 className="designer-json-header">Current Component as Declarative Output</h4>
								<pre className="designer-json">
									<p>
										<small>
											{this.state.serialized ? this.state.serialized :
												<span>Nothing to display yet! <br />Drag and drop elements in the design-tool on the right,
												<br />and click "Interpret!"</span>
											}
										</small>
									</p>
								</pre>
							</div>
						}
					</div>
					<div className="rotated-preview-switch">
						<Button onClick={
							() => {
								if (this.state.previewDisplay === "phone") {
									this.setState({ ...this.state, previewDisplay: "code" });
								} else {
									this.setState({ ...this.state, previewDisplay: "phone" });
								}
							}
						} raised primary style={{ background: '#010f27' }}>
							<FontIcon value={this.state.previewDisplay === "phone" ? "unfold_more" : "stay_current_landscape"} />
							-
							{this.state.previewDisplay === "phone" ? " show code " : " show phone "}
							-
							<FontIcon value={this.state.previewDisplay === "phone" ? "unfold_more" : "stay_current_landscape"} />
						</Button>
					</div>
				</div>
			</Splitter>
		</div >;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PureAppItptDesigner);
