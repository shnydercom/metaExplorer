import { Component, createRef } from "react";

import configuratorTestData from './../../../../testing/configuratorTestData';
import * as prefilledProductItptA from './../../../../testing/prefilledProductInterpreter.json';
import * as prefilledOrganizationItptA from './../../../../testing/prefilledOrganizationInterpreter.json';
import Button, { IconButton } from 'react-toolbox/lib/button';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import "storm-react-diagrams/dist/style.min.css";
import { EditorBody } from "./parts/EditorBody";
import { EditorLogic } from "./parts/editor-logic";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { connect } from "react-redux";
import { LDDict } from "ldaccess/LDDict";
import ldBlueprint, { BlueprintConfig, OutputKVMap } from "ldaccess/ldBlueprint";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps, LDLocalState } from "appstate/LDProps";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { editorTheme } from "styles/editor/editorTheme";
import { appTheme } from "styles/appTheme/appTheme";

import {
	Route,
	Link
} from 'react-router-dom';
import { Switch } from "react-router";
import { BaseContainerRewrite } from "../../../components/generic/baseContainer-rewrite";
import { FontIcon } from "react-toolbox/lib/font_icon";
import { intrprtrTypeInstanceFromBlueprint, addBlueprintToRetriever } from "appconfig/retrieverAccessFns";
import { isProduction } from "appstate/store";
import { Layout, Panel, Sidebar } from "react-toolbox/lib/layout";
import { NavDrawer } from "react-toolbox/lib/layout";
import { EditorTray as EditorTray } from "./parts/EditorTray";
import { DropRefmapResult } from "./parts/RefMapDropSpace";
import { Input } from "react-toolbox/lib/input";
import { ILDOptions } from "ldaccess/ildoptions";
import { initLDLocalState, gdsfpLD } from "components/generic/generatorFns";
import { NetworkPreferredToken } from "ldaccess/ildtoken";

export type AIEProps = {
	logic?: EditorLogic;
} & LDConnectedState & LDConnectedDispatch & LDOwnProps;

export type AIEState = {
	serialized: string;
	previewerToken: string;
	previewDisplay: "phone" | "code";
	hasCompletedFirstRender: boolean;
	currentlyEditingItptName: string | null;
	drawerActive: boolean;
	sidebarActive: boolean;
	mode: "editor" | "app" | "initial";
} & LDLocalState;

const EDITOR_KV_KEY = "EditorKvKey";

export const ITPT_BLOCK_EDITOR_NAME = "shnyder/block-editor";
export const ITPT_BLOCK_EDITOR_TYPE = "http://shnyder.com/editor/blockeditortype";
export const ITPT_BLOCK_EDITOR_EDITING_ITPT = "http://shnyder.com/editor/currentlyediting";
export const ITPT_BLOCK_EDITOR_DISPLAYING_ITPT = "http://shnyder.com/editor/currentlydisplaying";

let allMyInputKeys: string[] = [ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT];
let initialKVStores: IKvStore[] = [
	{
		key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
		value: undefined,
		ldType: LDDict.Text
	}
];
export const BlockEditorCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ITPT_BLOCK_EDITOR_NAME,
	canInterpretType: ITPT_BLOCK_EDITOR_TYPE,
	initialKvStores: initialKVStores,
	interpretableKeys: allMyInputKeys,
	crudSkills: "cRUd"
};

@ldBlueprint(BlockEditorCfg)
export class PureAppItptEditor extends Component<AIEProps, AIEState> {

	static getDerivedStateFromProps(nextProps: AIEProps, prevState: AIEState): AIEState | null {
		let rvLD = gdsfpLD(
			nextProps, prevState, [],
			[ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT],
			ITPT_BLOCK_EDITOR_TYPE,
			[], [false, false]);
		if (!rvLD) {
			return null;
		}
		if (rvLD) {
			let initiallyDisplayed = rvLD.localValues.get(ITPT_BLOCK_EDITOR_EDITING_ITPT);
			if (!!initiallyDisplayed && !prevState.currentlyEditingItptName) {
				return { ...prevState, currentlyEditingItptName: initiallyDisplayed };
			}
		}
		return null;
	}

	finalCanInterpretType: string = LDDict.ViewAction; // what type the itpt you're designing is capable of interpreting -> usually a new generic type
	logic: EditorLogic;
	errorNotAvailableMsg: string = "Itpt Editor environment not available. Please check your settings";

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	private sideBarRef = createRef<HTMLDivElement>();

	constructor(props?: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let previewerToken = null;
		previewerToken = props.ldTokenString + "-previewLDOptions";
		if (!props.logic) {
			var logic: EditorLogic = new EditorLogic(props.ldTokenString);
			this.logic = logic;
		} else {
			this.logic = props.logic;
		}
		const ldState = initLDLocalState(this.cfg, props, [],
			[ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT]);
		this.state = {
			...ldState,
			drawerActive: true, sidebarActive: true, mode: "initial",
			currentlyEditingItptName: null, serialized: "", previewerToken: previewerToken, previewDisplay: "phone", hasCompletedFirstRender: false
		};
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
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: EDITOR_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		let blankLDOptions = ldOptionsDeepCopy(newLDOptions);
		blankLDOptions.resource.kvStores = [];
		this.props.notifyLDOptionsChange(blankLDOptions);
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	// tslint:disable-next-line:member-ordering
	hascreatedFirst: boolean = false;

	generatePrefilled = (input: any) => {
		let nodesBPCFG: BlueprintConfig = input as BlueprintConfig;
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.ldToken = new NetworkPreferredToken(this.editTkString(newLDOptions.ldToken.get()));
		newLDOptions.resource.kvStores = [
			{ key: EDITOR_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}
	onMultiConfiguratorButtonClick = () => {
		this.props.notifyLDOptionsChange(null);
		let prefilledData: IKvStore[] = configuratorTestData;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = prefilledData;
		this.setState({ ...this.state, serialized: "" });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onPrefilledProductButtonClick = () => {
		let prefilledData: any = prefilledProductItptA;
		let nodesBPCFG: BlueprintConfig = prefilledData as BlueprintConfig;
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: EDITOR_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onPrefilledOrganizationButtonClick = () => {
		let prefilledData: any = prefilledOrganizationItptA;
		let nodesBPCFG: BlueprintConfig = prefilledData as BlueprintConfig;
		let dummyInstance = intrprtrTypeInstanceFromBlueprint(nodesBPCFG);
		addBlueprintToRetriever(nodesBPCFG);
		let nodesSerialized = JSON.stringify(nodesBPCFG, undefined, 2);
		let newType = nodesBPCFG.canInterpretType;
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		newLDOptions.resource.kvStores = [
			{ key: EDITOR_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	onIncreaseIDButtonClick = () => {
		let newLDOptions = ldOptionsDeepCopy(this.props.ldOptions);
		let kvChangeVar = newLDOptions.resource.kvStores.find((val) => val.ldType && val.ldType.endsWith(UserDefDict.standardItptObjectTypeSuffix));
		if (!kvChangeVar || !kvChangeVar.value) return;
		kvChangeVar.value.identifier = kvChangeVar.value.identifier !== null ? kvChangeVar.value.identifier + 1 : 0;
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	componentDidUpdate(prevProps: AIEProps & LDConnectedState & LDConnectedDispatch & LDOwnProps) {
		const { hasCompletedFirstRender, currentlyEditingItptName, mode } = this.state;
		if (!hasCompletedFirstRender && !!currentlyEditingItptName) {
			if (mode === "editor") {
				this.loadToEditorByName(this.state.currentlyEditingItptName, true);
			} else {
				this.loadToEditorByName(this.state.currentlyEditingItptName);
			}
			this.setState({ ...this.state, hasCompletedFirstRender: true });
		}
	}

	toggleDrawerActive = () => {
		let sideBar = this.sideBarRef.current;
		let sidebarActive = this.state.sidebarActive;
		let drawerActive = !this.state.drawerActive;
		if (sideBar) {
			if (sideBar.clientWidth >= window.innerWidth) {
				sidebarActive = false;
				drawerActive = true;
			}
		}
		this.setState({ ...this.state, drawerActive, sidebarActive });
	}
	toggleSidebar = () => {
		this.setState({ ...this.state, sidebarActive: !this.state.sidebarActive });
	}

	render() {
		if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
			return <div>{this.errorNotAvailableMsg}</div>;
		}
		const { mode } = this.state;

		return <Route path="/" render={(routeProps: LDRouteProps) => {
			if (routeProps.location.search === "?mode=editor" && mode !== "editor") {
				this.setState({ ...this.state, mode: "editor" });
			}
			if (routeProps.location.search === "?mode=app" && mode !== "app") {
				this.setState({ ...this.state, mode: "app" });
			}
			if (!routeProps.location.search && mode === "initial") {
				this.setState({ ...this.state, mode: "app" });
			}
			if (mode === "editor") {
				return this.renderEditor();
			} else
				if (mode === "app") {
					return this.renderApp();
				}
				else {
					return null;
				}
		}} />;
	}

	renderApp() {
		const { routes } = this.props;
		return (
			<div className="app-actual app-content">
				<BaseContainerRewrite routes={routes} ldTokenString={this.editTkString(this.props.ldTokenString)} />
				{!isProduction && <div className="mode-switcher">
					<Button className="editor-switch-btn" icon='edit' floating accent onClick={() => this.setState({ ...this.state, mode: "editor" })} />
				</div>
				}
			</div>
		);
		/*previously done through routing:
		<!--Link to={{ pathname: routes.location.pathname, search: "?mode=editor" }}>
							Switch to Editor
						</Link-->*/
	}

	renderEditor() {
		const { routes } = this.props;
		const { drawerActive, currentlyEditingItptName, sidebarActive } = this.state;
		let isDisplayDevContent = isProduction ? false : true;
		let inputStyle = currentlyEditingItptName ? { width: currentlyEditingItptName.length + "ex", maxHeight: "100%" } : null;
		const itpts = this.logic.getItptList();
		return <div className="entrypoint-editor">
			<ThemeProvider theme={editorTheme}>
				<Layout theme={{ layout: 'editor-layout' }}>
					<NavDrawer insideTree={true} theme={{ pinned: "navbar-pinned" }} active={drawerActive} withOverlay={false}
						pinned={drawerActive} permanentAt='xxxl'>
						<EditorTray
							itpts={itpts}
							onEditTrayItem={this.onEditTrayItem}
							onClearBtnPress={() => {
								this.logic.clear();
								this.setState({ ...this.state, currentlyEditingItptName: null });
							}}
							onZoomAutoLayoutPress={() => {
								this.logic.autoDistribute();
								this.logic.getDiagramEngine().recalculatePortsVisually();
								this.logic.getDiagramEngine().zoomToFit();
								this.forceUpdate();
							}}
						>
							<div className="fakeheader">
								<Button style={{ color: "white" }} onClick={() => this.setState({ ...this.state, mode: "app" })}>View in full size <FontIcon>fullscreen</FontIcon></Button>
								{/*<Link to={{ pathname: routes.location.pathname, search: "?mode=app" }}>
									View in full size <FontIcon>fullscreen</FontIcon>
						</Link>*/}
							</div>
						</EditorTray>
					</NavDrawer>
					<Panel theme={editorTheme} style={{ bottom: 0 }} >
						<EditorBody
							loadToEditorByName={this.loadToEditorByName}
							onEditTrayItem={this.onEditTrayItem}
							changeCurrentlyEditingItpt={(newItpt) => this.setState({ ...this.state, currentlyEditingItptName: newItpt })}
							currentlyEditingItpt={this.state.currentlyEditingItptName} logic={this.logic} />
					</Panel>
					<Sidebar theme={{ pinned: 'sidebar-pinned' }} insideTree={true} pinned={sidebarActive} width={10} active={sidebarActive}>
						<div ref={this.sideBarRef} className="phone-preview-container">
							{isDisplayDevContent ? <div style={{ alignSelf: "flex-start", position: "absolute" }}>
								<Button onClick={this.onInterpretBtnClick}>interpret!</Button>
								<Button onClick={this.onIncreaseIDButtonClick}>increaseID!</Button>
								<Button onClick={this.onPrefilledProductButtonClick}>Product!</Button>
								<Button onClick={this.onPrefilledOrganizationButtonClick}>Organization</Button>
								<Button onClick={this.onMultiConfiguratorButtonClick}>configuratorTest!</Button>
								<Link to="/editorinitial">initial   </Link>
								<Link to="/">   top route</Link>
							</div> : null}
							<div className="rotated-serialize">
								<Button onClick={this.onInterpretBtnClick} raised primary style={{ background: '#010f27aa' }}>
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
											<div className="app-content mdscrollbar">
												<Switch>
													<Route path="/editorinitial" render={() => (
														<div><b>drag and drop items into the editor</b></div>
													)} />
													<Route path="/" render={(routeProps: LDRouteProps) => {
														return <>
															<BaseContainerRewrite routes={routeProps} ldTokenString={this.editTkString(this.props.ldTokenString)} />
														</>;
													}} />
												</Switch>
											</div>
										</div>
									</ThemeProvider>
									:
									<div className="code-preview">
										<h4 className="editor-json-header">Current Component as Declarative Output</h4>
										<pre className="editor-json">
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
								} raised primary style={{ background: '#010f27aa' }}>
									<FontIcon value={this.state.previewDisplay === "phone" ? "unfold_more" : "stay_current_landscape"} />
									-
							{this.state.previewDisplay === "phone" ? " show code " : " show phone "}
									-
							<FontIcon value={this.state.previewDisplay === "phone" ? "unfold_more" : "stay_current_landscape"} />
								</Button>
							</div>
						</div>
						<div className="button-row">
							<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
								<Input style={inputStyle} value={currentlyEditingItptName ? currentlyEditingItptName : "None"} disabled={true} />
							</div>
						</div>
					</Sidebar>
				</Layout>
			</ThemeProvider>
			<div className="nav-element top-left">
				<IconButton className="large" icon='menu' onClick={this.toggleDrawerActive} inverse />
			</div>
			<div className="nav-element bottom-left">
				<IconButton icon={drawerActive ? "chevron_left" : "chevron_right"} style={{ color: "white" }} onClick={this.toggleDrawerActive}></IconButton>
			</div>
			<div className="nav-element bottom-right">
				<IconButton icon={sidebarActive ? "chevron_right" : "chevron_left"} style={{ color: "white" }} onClick={this.toggleSidebar}></IconButton>
			</div>
		</div >;
	}

	protected onEditTrayItem(data): DropRefmapResult {
		switch (data.type) {
			case "ldbp":
				this.logic.clear();
				let isLoadSuccess = this.loadToEditorByName(data.bpname);
				if (!isLoadSuccess) return { isSuccess: false, message: "interpreter is not a RefMap-Interpreter" };
				return { isSuccess: true, message: "check the diagram on the right to see your interpreter, or drop another Compound Block here to edit that one" };
			case "bdt":
				return { isSuccess: false, message: "simple data types can't be used here" };
			case "inputtype":
				return { isSuccess: false, message: "input type can't be used here" };
			case "outputtype":
				return { isSuccess: false, message: "output type can't be used here" };
			case "lineardata":
				return { isSuccess: false, message: "linear data display can't be used here" };
			default:
				break;
		}
		return { isSuccess: false, message: JSON.stringify(data) };
	}

	protected loadToEditorByName: (name: string, isAutodistribute?: boolean) => boolean = (name: string, isAutodistribute?: boolean) => {
		let itptInfo = this.logic.getItptList().find((itm) => itm.nameSelf === name);
		let itptCfg: BlueprintConfig = itptInfo.itpt.cfg;
		if (!itptCfg.initialKvStores
			|| itptCfg.initialKvStores.length < 1
			|| itptCfg.initialKvStores.findIndex((searchVal) => searchVal.key === UserDefDict.intrprtrBPCfgRefMapKey) === -1) {
			return false;
		}
		this.generatePrefilled(itptCfg);
		this.logic.diagramFromItptBlueprint(itptCfg);
		if (isAutodistribute) {
			this.logic.autoDistribute();
		}
		this.setState({ ...this.state, currentlyEditingItptName: itptCfg.nameSelf });
		return true;
	}

	protected editTkString: (inputTkStr: string) => string = (inputTkStr: string) => {
		return inputTkStr + "-edit";
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureAppItptEditor);
