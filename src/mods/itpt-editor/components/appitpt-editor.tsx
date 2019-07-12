import { Component, createRef } from "react";

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

import {
	Route
} from 'react-router-dom';
import { Redirect } from "react-router";
import { BaseContainerRewrite } from "../../../components/generic/baseContainer-rewrite";
import { intrprtrTypeInstanceFromBlueprint, addBlueprintToRetriever } from "appconfig/retrieverAccessFns";
import { isProduction } from "appstate/store";
import { EditorTray as EditorTray } from "./parts/EditorTray";
import { DropRefmapResult } from "./parts/RefMapDropSpace";
import { ILDOptions } from "ldaccess/ildoptions";
import { initLDLocalState, gdsfpLD } from "components/generic/generatorFns";
import { NetworkPreferredToken } from "ldaccess/ildtoken";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { UserInfo } from "./status/UserInfo";

import { MiniToolBox } from 'metaexplorer-react-components/lib/components/minitoolbox/dnd/minitoolbox-drag';
import { DropContainer } from 'metaexplorer-react-components/lib/components/minitoolbox/dnd/dropcontainer';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DND_MINI_TOOLBOX_TYPE } from "metaexplorer-react-components/lib/components/minitoolbox/dnd/interfaces";

export type AIEProps = {
	logic?: EditorLogic;
} & LDConnectedState & LDConnectedDispatch & LDOwnProps;

export type AIEState = {
	serialized: string;
	previewerToken: string;
	previewDisplay: "phone" | "code";
	hasCompletedFirstRender: boolean;
	hasCompletedEditorRender: boolean;
	currentlyEditingItptName: string | null;
	drawerActive: boolean;
	previewActive: boolean;
	drawerHidden: boolean;
	previewHidden: boolean;
	bottomBarHidden: boolean;
	mode: "editor" | "app" | "initial";
	redirect: null | string;
} & LDLocalState;

const EDITOR_KV_KEY = "EditorKvKey";

export const ITPT_BLOCK_EDITOR_NAME = "shnyder/block-editor";
export const ITPT_BLOCK_EDITOR_TYPE = "blockeditortype";

export const ITPT_BLOCK_EDITOR_EDITING_ITPT = "currentlyediting";
export const ITPT_BLOCK_EDITOR_DISPLAYING_ITPT = "currentlydisplaying";
export const ITPT_BLOCK_EDITOR_IS_GLOBAL = "isGlobal";
export const ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW = "isFullScreenPreview";
export const ITPT_BLOCK_EDITOR_HIDDEN_VIEWS = "hiddenViews";
export const ITPT_BLOCK_EDITOR_RETRIEVER_NAME = "retrieverName";

//active view-constants:
export const ITPT_BLOCK_EDITOR_AV_DRAWER = "drawer";
export const ITPT_BLOCK_EDITOR_AV_PREVIEW = "preview";
export const ITPT_BLOCK_EDITOR_AV_BOTTOMBAR = "bottombar";

let allMyInputKeys: string[] = [
	ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
	ITPT_BLOCK_EDITOR_IS_GLOBAL, ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW, ITPT_BLOCK_EDITOR_HIDDEN_VIEWS, ITPT_BLOCK_EDITOR_RETRIEVER_NAME,
	UserDefDict.username, UserDefDict.projectname
];
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
	},
	{
		key: ITPT_BLOCK_EDITOR_IS_GLOBAL,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: ITPT_BLOCK_EDITOR_HIDDEN_VIEWS,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: ITPT_BLOCK_EDITOR_RETRIEVER_NAME,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: UserDefDict.username,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: UserDefDict.projectname,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
		value: undefined,
		ldType: LDDict.Text
	},
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
		let redirState = null;
		if (nextProps.routes && nextProps.routes.location + "" === prevState.redirect) {
			redirState = { ...prevState, redirect: null };
		}
		let rvLD = gdsfpLD(
			nextProps, prevState, [],
			[...allMyInputKeys, UserDefDict.outputKVMapKey],
			ITPT_BLOCK_EDITOR_TYPE,
			[], [false, false, false, false, true, false, false, false, false]);
		if (!rvLD) {
			return redirState;
		}
		if (rvLD) {
			let initiallyDisplayed = rvLD.localValues.get(ITPT_BLOCK_EDITOR_EDITING_ITPT);
			let isGlobal = !!rvLD.localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);
			let isFSPreview = !!rvLD.localValues.get(ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW);
			let hiddenViews = rvLD.localValues.get(ITPT_BLOCK_EDITOR_HIDDEN_VIEWS);

			let mode = isGlobal
				? prevState.mode
				: isFSPreview ? "app" : "editor";
			let bottomBarHidden = prevState.bottomBarHidden;
			let drawerHidden = prevState.drawerHidden;
			let previewHidden = prevState.previewHidden;
			if (!!hiddenViews && hiddenViews.length > 0) {
				drawerHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_DRAWER);
				previewHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_PREVIEW);
				bottomBarHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_BOTTOMBAR);
			}
			if (!!initiallyDisplayed && !prevState.currentlyEditingItptName !== initiallyDisplayed) {
				return { ...prevState, currentlyEditingItptName: initiallyDisplayed, mode, bottomBarHidden, drawerHidden, previewHidden };
			} else {
				return { ...prevState, mode, bottomBarHidden, drawerHidden, previewHidden };
			}
		}
		return redirState;
	}

	finalCanInterpretType: string = LDDict.ViewAction; // what type the itpt you're designing is capable of interpreting -> usually a new generic type
	logic: EditorLogic;
	errorNotAvailableMsg: string = "Itpt Editor environment not available. Please check your settings";

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private sideBarRef = createRef<HTMLDivElement>();

	private editorWrapperRef = createRef<HTMLDivElement>();

	private diagramRef = createRef<EditorBody>();

	constructor(props?: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let previewerToken = null;
		previewerToken = props.ldTokenString + "-previewLDOptions";
		if (props.logic) {
			this.logic = props.logic;
		}
		const rvLD = initLDLocalState(this.cfg, props, [],
			[...allMyInputKeys, UserDefDict.outputKVMapKey],
			[], [false, false, false, false, true, false, false, false, false]);

		let initiallyDisplayed = rvLD.localValues.get(ITPT_BLOCK_EDITOR_EDITING_ITPT);
		let isGlobal = !!rvLD.localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);
		let isFSPreview = !!rvLD.localValues.get(ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW);
		let hiddenViews = rvLD.localValues.get(ITPT_BLOCK_EDITOR_HIDDEN_VIEWS);

		let mode: "initial" | "app" | "editor" = isGlobal
			? "initial"
			: isFSPreview ? "app" : "editor";
		let drawerActive = true;
		let previewActive = true;
		let bottomBarHidden = false;
		let drawerHidden = false;
		let previewHidden = false;

		if (!!hiddenViews && hiddenViews.length > 0) {
			drawerHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_DRAWER);
			previewHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_PREVIEW);
			bottomBarHidden = !!(hiddenViews as []).find((val) => val === ITPT_BLOCK_EDITOR_AV_BOTTOMBAR);
		}
		this.state = {
			...rvLD,
			redirect: null,
			mode, drawerActive, previewActive, bottomBarHidden, drawerHidden, previewHidden,
			currentlyEditingItptName: initiallyDisplayed, serialized: "", previewerToken: previewerToken, previewDisplay: "phone",
			hasCompletedFirstRender: false, hasCompletedEditorRender: false
		};
	}

	componentDidMount() {
		if (!this.logic) {
			let retrieverName = this.state.localValues.get(ITPT_BLOCK_EDITOR_RETRIEVER_NAME);
			retrieverName = retrieverName ? retrieverName : DEFAULT_ITPT_RETRIEVER_NAME;
			const username = this.state.localValues.get(UserDefDict.username);
			const userproj = this.state.localValues.get(UserDefDict.projectname);
			var logic: EditorLogic = new EditorLogic(this.props.ldTokenString, retrieverName, username, userproj);
			if (this.editorWrapperRef.current) {
				let height = this.editorWrapperRef.current.clientHeight;
				let width = this.editorWrapperRef.current.clientWidth;
				logic.setDimensions(width, height);
				logic.newModel(this.props.ldTokenString);
			}
			logic.setOnOutputInfoSaved(() => this.onInterpretBtnClick(null));
			this.logic = logic;
		}
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		} else {
			this.evalPreviewReload();
		}
	}

	componentDidUpdate(prevProps: AIEProps & LDConnectedState & LDConnectedDispatch & LDOwnProps) {
		this.evalPreviewReload();
	}

	toggleDrawerActive = () => {
		let sideBar = this.sideBarRef.current;
		let previewActive = this.state.previewActive;
		let drawerActive = !this.state.drawerActive;
		if (sideBar) {
			if (sideBar.clientWidth >= window.innerWidth) {
				previewActive = false;
				drawerActive = true;
			}
		}
		this.setState({ ...this.state, drawerActive, previewActive: previewActive });
	}
	togglePreview = () => {
		this.setState({ ...this.state, previewActive: !this.state.previewActive });
	}

	render() {
		if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
			return <div>{this.errorNotAvailableMsg}</div>;
		}
		const { mode, localValues, redirect } = this.state;
		let isGlobal = !!localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);

		if (!!redirect) {
			this.setState({ ...this.state, redirect: null });
			return <Redirect to={redirect} />;
		}
		if (isGlobal) {
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
		if (mode === "editor") {
			return this.renderEditor();
		} else
			if (mode === "app") {
				return this.renderApp();
			}
			else {
				return null;
			}
	}

	toggleFullScreen() {
		if (this.state.mode === "editor") {
			this.setState({ ...this.state, mode: "app" });
		} else {
			this.setState({ ...this.state, mode: "editor" });
		}
	}

	triggerNavToTop() {
		const redirTo = "/";
		if (this.props.routes.location + "" !== redirTo) {
			this.setState({ ...this.state, redirect: redirTo });
		}
	}

	renderApp() {
		const { routes } = this.props;
		return (
			<div className="app-actual app-content">
				<BaseContainerRewrite routes={routes} ldTokenString={this.editTkString(this.props.ldTokenString)} />
				<div className="mode-switcher">
					{/**icon='edit' floating accent  */}
					<button className="editor-switch-btn" onClick={() => this.toggleFullScreen.apply(this)} />
				</div>
			</div>
		);
	}

	renderEditor() {
		const { drawerActive, currentlyEditingItptName, previewActive, localValues, bottomBarHidden, previewHidden, drawerHidden } = this.state;
		const isGlobal = localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);
		if (!this.logic) {
			return <div className="entrypoint-editor" ref={this.editorWrapperRef}></div>;
		}
		const itpts = this.logic.getItptList();
		// , navDrawerClipped: 'editor-navbar-clipped'
		return <DndProvider backend={HTML5Backend}>
			<div className="entrypoint-editor" ref={this.editorWrapperRef}>
				<div className='editor-layout'>
					{drawerHidden
						? null
						: <div className={`nav-drawer-wrapper ${drawerActive ? "active" : "inactive"}`}>
							<EditorTray itpts={itpts} onEditTrayItem={this.onEditTrayItem.bind(this)}
								onClearBtnPress={() => {
									this.logic.clear();
									this.setState({ ...this.state, currentlyEditingItptName: null });
								}}
								onZoomAutoLayoutPress={() => {
									this.logic.autoDistribute();
									this.diagramRef.current.forceUpdate();
								}}
							>
								<div className="fakeheader">
									<UserInfo userLabel="John Doe" projectLabel="JohnsPersonalProject" userIconSrc="" />
									{
										isGlobal
											? <button style={{ color: "white" }} onClick={() => this.toggleFullScreen.apply(this)}>View in full size FontIconfullscreenFontIcon</button>
											: null
									}
								</div>
							</EditorTray>
						</div>
					}
					<div>
						<EditorBody hideRefMapDropSpace={bottomBarHidden}
							ref={this.diagramRef}
							loadToEditorByName={this.loadToEditorByName}
							onEditTrayItem={this.onEditTrayItem.bind(this)}
							changeCurrentlyEditingItpt={(newItpt) => this.setState({ ...this.state, currentlyEditingItptName: newItpt })}
							currentlyEditingItpt={this.state.currentlyEditingItptName} logic={this.logic} />
						{previewHidden ? null : this.renderPreview(isGlobal, previewActive)}
					</div>
					{drawerHidden
						? null
						: <>
							<div className="nav-element top-left">
								{/** icon='menu' inverse*/}
								<button
									className={`editorbtn ${drawerActive ? "isopen" : ""} editorbtn-toleft editorbtn-large`}
									onClick={this.toggleDrawerActive} />
							</div>
							<div className="nav-element bottom-left">
								{/**icon={drawerActive ? "chevron_left" : "chevron_right"} */}
								<button
									className={`editorbtn ${drawerActive ? "isopen" : ""} editorbtn-toleft editorbtn-small`}
									style={{ color: "white" }}
									onClick={this.toggleDrawerActive}></button>
							</div>
						</>
					}
				</div>
			</div>
		</DndProvider>;
	}

	protected renderPreview(isGlobal: boolean, previewActive: boolean) {
		let isDisplayDevContent = isProduction ? false : true;
		let previewContainerClass = "editorpreview";
		if (previewActive) {
			previewContainerClass += " active";
		} else {
			previewContainerClass += " inactive";
		}
		//
		//div className={previewContainerClass}>
		return <>
			{this.state.previewDisplay === "phone" ?
				<>
					<DropContainer isDropZoneClickthrough>
						<MiniToolBox
							id="a"
							left={0}
							top={0}
							type={DND_MINI_TOOLBOX_TYPE}
						>
							<div className="app-content mdscrollbar">
								<BaseContainerRewrite routes={this.props.routes} ldTokenString={this.editTkString(this.props.ldTokenString)} />
							</div>
						</MiniToolBox>
					</DropContainer>
					{/*
					<div className={`${previewContainerClass}-minimenu`}>
						<button onClick={() => this.togglePreview.apply(this)} />
					</div>
					<div>
						<div className="app-preview">
							<div className="phone-preview-btns">
								{isDisplayDevContent ? this.renderBtnSwitchPreviewOrCode() : null}
								{this.renderPhoneNavBtns(isGlobal)}
							</div>
							<div className="app-content mdscrollbar">
								<BaseContainerRewrite routes={this.props.routes} ldTokenString={this.editTkString(this.props.ldTokenString)} />
							</div>
						</div>
					</div>*/}
				</>
				:
				<div className="code-preview">
					<div className="editor-json-header">
						<h4>Developer Mode: Declarative Output</h4>
						{this.renderBtnSwitchPreviewOrCode()}
					</div>
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
		</>;
	}

	protected renderPhoneNavBtns(isGlobal: boolean) {
		return <>
			{isGlobal
				? <>
					<button onClick={() => this.toggleFullScreen.apply(this)} className="fullscreen" />{/*primary icon="fullscreen"*/}
					<button onClick={() => this.triggerNavToTop.apply(this)} />{/**primary icon="arrow_upward" */}
				</>
				: null
			}
			{/**primary icon="chevron_right"  */}
			<button onClick={() => this.togglePreview.apply(this)} />
		</>;
	}

	protected renderBtnSwitchPreviewOrCode() {
		// icon={"phone" ? "unfold_more" : "stay_current_landscape"}
		return <button
			onClick={
				() => {
					if (this.state.previewDisplay === "phone") {
						this.setState({ ...this.state, previewDisplay: "code" });
					} else {
						this.setState({ ...this.state, previewDisplay: "phone" });
					}
				}
			} style={{ background: '#010f27aa' }}>{/**primary */}
		</button>;
	}

	protected onInterpretBtnClick = (e) => {
		if (e) e.preventDefault();
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
		this.dispatchCurrentlyEditingChange(nodesBPCFG.nameSelf);
	}

	protected dispatchCurrentlyEditingChange = (currentlyEditingName: string) => {
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		let outCurItptKV: IKvStore = {
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: currentlyEditingName,
			ldType: LDDict.Text
		};
		this.props.dispatchKvOutput([outCurItptKV], this.props.ldTokenString, outputKVMap);
	}

	protected onEditTrayItem(data): DropRefmapResult {
		switch (data.type) {
			case "ldbp":
				this.logic.clear();
				let isLoadSuccess = this.loadToEditorByName(data.bpname, true);
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

	protected evalPreviewReload() {
		const { hasCompletedFirstRender, currentlyEditingItptName, mode, hasCompletedEditorRender } = this.state;
		if (!!currentlyEditingItptName) {
			if (!hasCompletedFirstRender) {
				console.log("evaluating preview reload");
				if (mode === "editor") {
					this.loadToEditorByName(this.state.currentlyEditingItptName, true);
					this.setState({ ...this.state, hasCompletedFirstRender: true, hasCompletedEditorRender: true });
					return;
				} else if (mode === "initial") {
					this.loadToEditorByName(this.state.currentlyEditingItptName);
				}
				this.setState({ ...this.state, hasCompletedFirstRender: true });
				return;
			} else if (!hasCompletedEditorRender && !!this.diagramRef.current) {
				this.loadToEditorByName(this.state.currentlyEditingItptName, true);
				this.setState({ ...this.state, hasCompletedEditorRender: true });
			}
		}
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
		this.logic.clear();
		this.logic.diagramFromItptBlueprint(itptCfg);
		if (isAutodistribute) {
			this.logic.autoDistribute();
		}
		this.setState({ ...this.state, currentlyEditingItptName: itptCfg.nameSelf });
		return true;
	}

	protected generatePrefilled = (input: any) => {
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

	protected editTkString: (inputTkStr: string) => string = (inputTkStr: string) => {
		return inputTkStr + "-edit";
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureAppItptEditor);
