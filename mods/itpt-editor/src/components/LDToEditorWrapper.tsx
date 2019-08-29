import {
	addBlueprintToRetriever, BaseContainerRewrite, BlueprintConfig, DEFAULT_ITPT_RETRIEVER_NAME, gdsfpLD, IKvStore, ILDOptions,
	initLDLocalState, intrprtrTypeInstanceFromBlueprint, ldBlueprint, LDConnectedDispatch, LDConnectedState, LDDict, LDLocalState,
	ldOptionsDeepCopy, LDOwnProps, mapDispatchToProps, mapStateToProps, NetworkPreferredToken, OutputKVMap, UserDefDict,
	IAsyncRequestWrapper,
	COMP_BASE_CONTAINER
} from "@metaexplorer/core";
import { keys } from "lodash";
import { DragItem, ActiveStates } from "metaexplorer-react-components";
import React, { Component, createRef } from "react";
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
//import TouchBackend from 'react-dnd-touch-backend';
import { connect } from "react-redux";
import { Redirect } from "react-router";
//import { Route } from 'react-router-dom';
import "storm-react-diagrams/dist/style.min.css";
import { IEditorBlockData, EditorDNDItemType } from "./editorInterfaces";
import { BaseDataTypeNodeModel } from "./node-editor/basedatatypes/BaseDataTypeNodeModel";
import { DeclarationPartNodeModel } from "./node-editor/declarationtypes/DeclarationNodeModel";
import { NodeEditorLogic, editorSpecificNodesColor, editorDefaultNodesColor } from "./node-editor/NodeEditorLogic";
import { NodeEditorBody } from "./node-editor/NodeEditorBody";
import { EditorTray as EditorTray, EditorTrayProps } from "./content/blockselection/EditorTray";
import { ExtendableTypesNodeModel } from "./node-editor/extendabletypes/ExtendableTypesNodeModel";
import { GeneralDataTypeNodeModel } from "./node-editor/generaldatatypes/GeneralDataTypeNodeModel";
import { LDPortModel } from "./node-editor/_super/LDPortModel";
import { UserInfo } from "./content/status/UserInfo";
import { EditorMain } from "./EditorMain";
import { INewNameObj } from "./new-itpt/newItptNodeDummy";
import { TXT_INIT } from "./content/status/SaveStatus";
import * as shortid from "shortid";

const DNDBackend = HTML5Backend;// TouchBackend; //HTML5Backend

export type AIEProps = {
	logic?: NodeEditorLogic;
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
	isDropZoneClickThrough: boolean;
	saveStatus: IAsyncRequestWrapper;
	previewActiveState: ActiveStates;
	previewIsMini: boolean;
} & LDLocalState;

const EDITOR_KV_KEY = "EditorKvKey";

export const ITPT_BLOCK_EDITOR_NAME = "shnyder/block-editor";
export const ITPT_BLOCK_EDITOR_TYPE = "blockeditortype";

export const ITPT_BLOCK_EDITOR_EDITING_ITPT = "currentlyediting";
export const ITPT_BLOCK_EDITOR_SAVING_STATUS = "savingStatus";

export const ITPT_BLOCK_EDITOR_DISPLAYING_ITPT = "currentlydisplaying";
export const ITPT_BLOCK_EDITOR_IS_GLOBAL = "isGlobal";
export const ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW = "isFullScreenPreview";
export const ITPT_BLOCK_EDITOR_HIDDEN_VIEWS = "hiddenViews";
export const ITPT_BLOCK_EDITOR_RETRIEVER_NAME = "retrieverName";

//active view-constants:
export const ITPT_BLOCK_EDITOR_AV_DRAWER = "drawer";
export const ITPT_BLOCK_EDITOR_AV_PREVIEW = "preview";
export const ITPT_BLOCK_EDITOR_AV_BOTTOMBAR = "bottombar";

export const SAVE_ACTION_LDTYPE = "SaveAction_LDType"

let allMyInputKeys: string[] = [
	ITPT_BLOCK_EDITOR_EDITING_ITPT, ITPT_BLOCK_EDITOR_DISPLAYING_ITPT,
	ITPT_BLOCK_EDITOR_IS_GLOBAL, ITPT_BLOCK_EDITOR_IS_FULLSCREEN_PREVIEW, ITPT_BLOCK_EDITOR_HIDDEN_VIEWS, ITPT_BLOCK_EDITOR_RETRIEVER_NAME,
	UserDefDict.username, UserDefDict.projectname, SAVE_ACTION_LDTYPE, ITPT_BLOCK_EDITOR_SAVING_STATUS
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
		key: SAVE_ACTION_LDTYPE,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: ITPT_BLOCK_EDITOR_SAVING_STATUS,
		value: undefined,
		ldType: UserDefDict.responseWrapperType
	},
	{
		key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
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
		let redirState = null;
		if (nextProps.routes && nextProps.routes.location + "" === prevState.redirect) {
			redirState = { ...prevState, redirect: null };
		}
		let rvLD = gdsfpLD(
			nextProps, prevState, [],
			[...allMyInputKeys, UserDefDict.outputKVMapKey],
			ITPT_BLOCK_EDITOR_TYPE,
			[], [false, false, false, false, true, false, false, false, false, false, false]);
		if (!rvLD) {
			if (prevState.redirect === null) return null;
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
			let lSavingStat = rvLD.localValues.get(ITPT_BLOCK_EDITOR_SAVING_STATUS);
			console.log(lSavingStat);
			if (!lSavingStat) lSavingStat = {
				status: 'warning',
				statusPayload: "not connected"
			}
			let newState = null;
			if (!!initiallyDisplayed && !prevState.currentlyEditingItptName) {
				newState = { ...prevState, ...rvLD, saveStatus: lSavingStat, currentlyEditingItptName: initiallyDisplayed, mode, bottomBarHidden, drawerHidden, previewHidden };
			} else {
				newState = { ...prevState, ...rvLD, saveStatus: lSavingStat, mode, bottomBarHidden, drawerHidden, previewHidden };
			}
			if (JSON.stringify(newState) === JSON.stringify(prevState)) return null;
			return newState;
		}
		return redirState;
	}

	finalCanInterpretType: string = LDDict.ViewAction; // what type the itpt you're designing is capable of interpreting -> usually a new generic type
	logic: NodeEditorLogic;
	errorNotAvailableMsg: string = "Itpt Editor environment not available. Please check your settings";

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];

	private sideBarRef = createRef<HTMLDivElement>();

	private editorWrapperRef = createRef<HTMLDivElement>();

	private diagramRef = createRef<NodeEditorBody>();

	constructor(props?: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		let previewerToken = this.editTkString(props.ldTokenString);
		if (props.logic) {
			this.logic = props.logic;
		}
		const rvLD = initLDLocalState(this.cfg, props, [],
			[...allMyInputKeys, UserDefDict.outputKVMapKey],
			[], [false, false, false, false, true, false, false, false, false, false, false]);

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
			hasCompletedFirstRender: false, hasCompletedEditorRender: false,
			isDropZoneClickThrough: true,
			saveStatus: {
				status: 'success',
				statusPayload: TXT_INIT
			},
			previewIsMini: false,
			previewActiveState: "phoneEd"
		};
	}

	componentDidMount() {
		if (!this.logic) {
			let retrieverName = this.state.localValues.get(ITPT_BLOCK_EDITOR_RETRIEVER_NAME);
			retrieverName = retrieverName ? retrieverName : DEFAULT_ITPT_RETRIEVER_NAME;
			const username = this.state.localValues.get(UserDefDict.username);
			const userproj = this.state.localValues.get(UserDefDict.projectname);
			var logic: NodeEditorLogic = new NodeEditorLogic(this.props.ldTokenString, retrieverName, username, userproj);
			if (this.editorWrapperRef.current) {
				let height = this.editorWrapperRef.current.clientHeight;
				let width = this.editorWrapperRef.current.clientWidth;
				logic.setDimensions(width, height);
				logic.newModel(this.props.ldTokenString);
			}
			logic.setOnOutputInfoSaved(() => this.onSaveDiagramTriggered());
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

	toggleDrawerActive() {
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
	togglePreview() {
		this.setState({ ...this.state, previewActive: !this.state.previewActive });
	}

	render() {
		console.log("rendering LDtoEditorWrapper")
		const { drawerActive, bottomBarHidden, drawerHidden, currentlyEditingItptName, saveStatus } = this.state;
		//const isGlobal = localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);
		const itpts = this.logic ? this.logic.getItptList() : [];
		const editorTrayProps: EditorTrayProps = {
			itpts,
			onEditTrayItem: this.changeNodeCurrentlyEditing.bind(this),
			onZoomAutoLayoutPress: () => {
				this.logic.autoDistribute();
				this.diagramRef.current.forceUpdate();
			}
		}
		const miniProps: {
			onMiniChanged: (isMini: boolean) => void;
			onActiveStateChanged: (activeState: ActiveStates) => void;
			isMini: boolean;
			onUpClick: () => void;
			activeState: ActiveStates;
		} = {
			activeState: this.state.previewActiveState,
			isMini: this.state.previewIsMini,
			onMiniChanged: (isMini) => {
				this.setState({ ...this.state, previewIsMini: !isMini })
			},
			onActiveStateChanged: (activeState) => {
				this.setState({ ...this.state, previewActiveState: activeState, previewIsMini: false })
			},
			onUpClick: () => this.triggerNavToTop()
		}
		if (!this.logic) return <div>loading Editor</div>;
		if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
			return <div>{this.errorNotAvailableMsg}</div>;
		}
		const { /*mode, localValues,*/ redirect } = this.state;
		//let isGlobal = !!localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);

		if (!!redirect) {
			this.setState({ ...this.state, redirect: null });
			return <Redirect to={redirect} />;
		}
		return <EditorMain
			{...miniProps}
			saveStatus={saveStatus}
			onNewBtnClick={(newNameObj) => this.setNodeEditorToNew(newNameObj)}
			changeNodeCurrentlyEditing={this.changeNodeCurrentlyEditing.bind(this)}
			currentlyEditingItpt={currentlyEditingItptName}
			onBlockItemDropped={(blockItem) => this.addBlockToDiagram(blockItem)}
			isLeftDrawerActive={drawerActive}
			trayProps={editorTrayProps}
			isPreviewFullScreen={false}
			previewLDTokenString={this.state.previewerToken}
			routes={this.props.routes}
			onZoomAutoLayoutPress={() => {
				this.logic.autoDistribute();
				this.diagramRef.current.forceUpdate();
			}}
		>
			<NodeEditorBody hideRefMapDropSpace={bottomBarHidden}
				ref={this.diagramRef}
				loadToEditorByName={this.loadToEditorByName}
				changeCurrentlyEditingItpt={(newItpt) => this.setState({ ...this.state, currentlyEditingItptName: newItpt })}
				currentlyEditingItpt={this.state.currentlyEditingItptName} logic={this.logic} />
			{drawerHidden
				? null
				: <>
					<div className="nav-element top-left">
						<button
							className={`editorbtn ${drawerActive ? "isopen" : ""} editorbtn-toleft editorbtn-large`}
							onClick={this.toggleDrawerActive.bind(this)} />
					</div>
					<div className="nav-element bottom-left">
						<button
							className={`editorbtn ${drawerActive ? "isopen" : ""} editorbtn-toleft editorbtn-small`}
							style={{ color: "white" }}
							onClick={this.toggleDrawerActive.bind(this)}></button>
					</div>
				</>
			}
		</EditorMain >;
		/*if (!this.props || !this.props.ldTokenString || this.props.ldTokenString.length === 0) {
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
			}*/
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
					<button className="editor-switch-btn" onClick={() => this.toggleFullScreen.apply(this)} />
				</div>
			</div>
		);
	}

	setNodeEditorToNew(newNameObj: INewNameObj) {
		this.logic.clear();
		const containerID = shortid.generate();
		const boldID = shortid.generate();
		const invitationText: string = "Get Started!";
		const itptName: string = newNameObj.concatTitle;
		const newBpCfg: BlueprintConfig = {
			subItptOf: containerID,
			canInterpretType: itptName + UserDefDict.standardItptObjectTypeSuffix,
			nameSelf: itptName,
			initialKvStores: [
				{
					key: UserDefDict.intrprtrBPCfgRefMapKey,
					value: {
						[containerID]: {
							subItptOf: COMP_BASE_CONTAINER,
							canInterpretType: UserDefDict.itptContainerObjType,
							nameSelf: containerID,
							initialKvStores: [
								{
									key: "in_0",
									value: {
										objRef: boldID,
										propRef: null
									},
									ldType: "InterpreterClassType"
								}
							],
							crudSkills: "cRud",
							interpretableKeys: [
								"in_0"
							]
						},
						[boldID]: {
							"subItptOf": "shnyder/basichtml/bold",
							"canInterpretType": "http://schema.org/Text",
							"nameSelf": boldID,
							"initialKvStores": [
								{
									"key": "inputdata",
									"value": invitationText,
									"ldType": "http://schema.org/Text"
								}
							],
							"crudSkills": "cRud",
							"interpretableKeys": []
						}
					},
					ldType: UserDefDict.intrprtrBPCfgRefMapType
				}
			],
			crudSkills: "cRud",
			interpretableKeys: []
		};
		this.generatePrefilled(newBpCfg);
		this.logic.diagramFromItptBlueprint(newBpCfg);
		this.logic.autoDistribute();
		this.setState({ ...this.state, currentlyEditingItptName: itptName });
	}

	renderEditor() {
		const { drawerActive, previewActive, localValues, bottomBarHidden, previewHidden, drawerHidden } = this.state;
		const isGlobal = localValues.get(ITPT_BLOCK_EDITOR_IS_GLOBAL);
		if (!this.logic) {
			return <div className="entrypoint-editor" ref={this.editorWrapperRef}></div>;
		}
		const itpts = this.logic.getItptList();
		return <DndProvider backend={DNDBackend}>
			<div className="entrypoint-editor" ref={this.editorWrapperRef}>
				<div className='editor-layout'>
					{drawerHidden
						? null
						: <div className={`nav-drawer-wrapper ${drawerActive ? "active" : "inactive"}`}>
							<EditorTray
								itpts={itpts}
								onEditTrayItem={this.changeNodeCurrentlyEditing.bind(this)}
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
						<NodeEditorBody hideRefMapDropSpace={bottomBarHidden}
							ref={this.diagramRef}
							loadToEditorByName={this.loadToEditorByName}
							changeCurrentlyEditingItpt={(newItpt) => this.setState({ ...this.state, currentlyEditingItptName: newItpt })}
							currentlyEditingItpt={this.state.currentlyEditingItptName} logic={this.logic} />
						{previewHidden ? null : this.renderPreview(isGlobal, previewActive)}
					</div>
					{drawerHidden
						? null
						: <>
							<div className="nav-element top-left">
								<button
									className={`editorbtn ${drawerActive ? "isopen" : ""} editorbtn-toleft editorbtn-large`}
									onClick={this.toggleDrawerActive} />
							</div>
							<div className="nav-element bottom-left">
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
		return <>
			{/*this.state.previewDisplay === "phone" ?
				<>
					<DropContainer isDropZoneClickthrough={this.state.isDropZoneClickThrough}
						onBlockDropped={(itm: DragItem) => {
							console.dir(itm);
							this.addBlockToDiagram(itm)
						}}>
						<MiniToolBox
							id="a"
							left={0}
							top={0}
							type={DND_MINI_TOOLBOX_TYPE}
							onOutDragHandle={() => this.setIsDropZoneClickThrough(true)}
							onOverDragHandle={() => this.setIsDropZoneClickThrough(false)}
						>
							<div className="app-content mdscrollbar">
								<BaseContainerRewrite routes={this.props.routes} ldTokenString={this.editTkString(this.props.ldTokenString)} />
							</div>
						</MiniToolBox>
					</DropContainer>
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
			*/}
		</>;
	}

	protected renderPhoneNavBtns(isGlobal: boolean) {
		return <>
			{isGlobal
				? <>
					<button onClick={() => this.toggleFullScreen.apply(this)} className="fullscreen" />
					<button onClick={() => this.triggerNavToTop.apply(this)} />
				</>
				: null
			}
			<button onClick={() => this.togglePreview.apply(this)} />
		</>;
	}

	protected renderBtnSwitchPreviewOrCode() {
		return <button
			onClick={
				() => {
					if (this.state.previewDisplay === "phone") {
						this.setState({ ...this.state, previewDisplay: "code" });
					} else {
						this.setState({ ...this.state, previewDisplay: "phone" });
					}
				}
			} style={{ background: '#010f27aa' }}>
		</button>;
	}

	protected onSaveDiagramTriggered() {
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
		newLDOptions.ldToken = new NetworkPreferredToken(this.editTkString(newLDOptions.ldToken.get()));
		newLDOptions.resource.kvStores = [
			{ key: EDITOR_KV_KEY, ldType: newType, value: dummyInstance }
		];
		this.setState({ ...this.state, serialized: nodesSerialized });
		let blankLDOptions = ldOptionsDeepCopy(newLDOptions);
		blankLDOptions.resource.kvStores = [];
		this.props.notifyLDOptionsChange(blankLDOptions);
		this.props.notifyLDOptionsChange(newLDOptions);
		this.dispatchNodesSerializedChange(nodesSerialized);
		if (this.state.currentlyEditingItptName !== nodesBPCFG.nameSelf) {
			this.dispatchCurrentlyEditingChange(nodesBPCFG.nameSelf);
		}
	}

	protected dispatchNodesSerializedChange(nodesSerialized: string) {
		let saveActionType: string = this.state.localValues.get(SAVE_ACTION_LDTYPE);
		if (saveActionType) {
			this.props.dispatchLdAction(null, saveActionType, nodesSerialized);
		}
		/*
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		let outNodesSerializedKV: IKvStore = {
			key: ITPT_BLOCK_EDITOR_SERIALIZED_REFMAP_BPCFG,
			value: nodesSerialized,
			ldType: UserDefDict.itptRefMapBpCfg
		}
		this.props.dispatchKvOutput([outNodesSerializedKV], this.props.ldTokenString, outputKVMap);*/
	}

	protected dispatchCurrentlyEditingChange(currentlyEditingName: string) {
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		let outCurItptKV: IKvStore = {
			key: ITPT_BLOCK_EDITOR_EDITING_ITPT,
			value: currentlyEditingName,
			ldType: LDDict.Text
		};
		this.props.dispatchKvOutput([outCurItptKV], this.props.ldTokenString, outputKVMap);
	}

	protected addBlockToDiagram(dndItem: DragItem<EditorDNDItemType, IEditorBlockData>) {
		const data: IEditorBlockData = dndItem.data;
		var nodesCount = keys(
			this.logic
				.getDiagramEngine()
				.getDiagramModel()
				.getNodes()
		).length;
		var node = null;
		switch (data.type) {
			case "ldbp":
				let nodeName: string = "Node " + (nodesCount + 1) + ":";
				node = new GeneralDataTypeNodeModel(nodeName, null, null, editorDefaultNodesColor);
				if (data.bpname) {
					this.logic.addLDPortModelsToNodeFromItptRetr(node, data.bpname);
				}
				if (data.canInterpretType) node.canInterpretType = data.canInterpretType;
				break;
			case "bdt":
				var baseDataTypeKVStore: IKvStore = {
					key: UserDefDict.outputSelfKey,
					value: undefined,
					ldType: undefined
				};
				node = new BaseDataTypeNodeModel("Simple Data Type", null, null, editorDefaultNodesColor);
				node.addPort(new LDPortModel(false, "out-3", baseDataTypeKVStore, "output"));
				break;
			case "inputtype":
				var inputDataTypeKVStore: IKvStore = {
					key: UserDefDict.externalInput,
					value: undefined,
					ldType: undefined
				};
				node = new DeclarationPartNodeModel("External Input Marker", null, null, editorSpecificNodesColor);
				node.addPort(new LDPortModel(false, "out-4", inputDataTypeKVStore, UserDefDict.externalInput));
				break;
			case "outputtype":
				var outputDataTypeKVStore: IKvStore = {
					key: UserDefDict.externalOutput,
					value: undefined,
					ldType: undefined
				};
				node = new DeclarationPartNodeModel("External Output Marker", null, null, editorSpecificNodesColor);
				node.addPort(new LDPortModel(true, "in-4", outputDataTypeKVStore, UserDefDict.externalOutput));
				break;
			case "lineardata":
				node = new ExtendableTypesNodeModel("Linear Data Display", null, null, editorSpecificNodesColor);
				let outputSelfKV: IKvStore = {
					key: UserDefDict.outputSelfKey,
					value: undefined,
					ldType: UserDefDict.intrprtrClassType
				};
				node.addPort(new LDPortModel(false, outputSelfKV.key, outputSelfKV));
				break;
			default:
				break;
		}
		var points = this.logic.getDiagramEngine().getRelativeMousePoint(event);
		node.x = points.x - 224 / 2;
		node.y = points.y - 32 / 2;
		this.logic
			.getDiagramEngine()
			.getDiagramModel()
			.addNode(node);
		this.forceUpdate();
	}

	protected changeNodeCurrentlyEditing(data: IEditorBlockData): {} {
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

	protected loadToEditorByName(name: string, isAutodistribute?: boolean) {
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

	protected generatePrefilled(input: any) {
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

	protected editTkString(inputTkStr: string) {
		return inputTkStr + "-edit";
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureAppItptEditor);
