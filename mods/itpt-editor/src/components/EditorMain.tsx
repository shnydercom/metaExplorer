import * as React from 'react';
import { ITPTFullscreen } from './content/ITPTFullscreen';
import { LDRouteProps, BaseContainerRewrite } from '@metaexplorer/core';
import { ITransitComp, ITabData, Tabs, MiniToolBox, DragItem, StylableDragItemProps, ActiveStates } from 'metaexplorer-react-components';
import { EditorDNDItemType, IEditorBlockData, IEditorPreviewData, EditorClientPosition } from './editorInterfaces';
import { EditorTrayItem, EditorTrayItemProps } from './content/blockselection/EditorTrayItem';
import { PreviewMoveLayer, MTBItemDragContainer } from './panels/PreviewMoveLayer';

import { DNDEnabler } from './panels/DNDEnabler';
import { MainEditorDropLayer } from './panels/MainEditorDropLayer';
import { EditorTrayProps, EditorTray } from './content/blockselection/EditorTray';
import { UserInfo } from './content/status/UserInfo';
import { TabDropLayer } from './panels/TabDropLayer';
import { NewItptPanel } from './new-itpt/newItptPanel';
import { NewItptNode, IITPTNameObj } from './new-itpt/newItptNodeDummy';
import { SaveStatus } from './content/status/SaveStatus';
import { IAsyncRequestWrapper } from '@metaexplorer/core';

const DND_CLASS = 'entrypoint-editor'
const TRANSIT_CLASS = 'editor-transit'

export interface EditorMainProps {
	isPreviewFullScreen: boolean;
	previewLDTokenString: string;
	routes: LDRouteProps;
	trayProps: EditorTrayProps;
	isLeftDrawerActive: boolean;
	currentlyEditingItpt: string;
	onZoomAutoLayoutPress: () => void;
	onBlockItemDropped: (blockItem: DragItem<EditorDNDItemType, IEditorBlockData>, clientPosition: EditorClientPosition) => void;
	changeNodeCurrentlyEditing(data: IEditorBlockData): {};
	onNewBtnClick: (newNameObj: IITPTNameObj) => void;
	saveStatus: IAsyncRequestWrapper;
	onMiniChanged?: (isMini: boolean) => void;
	onUpClick?: () => void;
	onActiveStateChanged?: (activeState: ActiveStates) => void;
	isMini?: boolean;
	activeState?: ActiveStates;
}

type TabTypes = "nodeEditor" | "newNode";

export const EditorMain = (props: React.PropsWithChildren<EditorMainProps>) => {

	const [activeTab, setActiveTab] = React.useState<TabTypes>("nodeEditor")

	const [isPreviewFullScreen, setIsPreviewFullScreen] = React.useState<boolean>(props.isPreviewFullScreen)

	const [previewPosition, setPreviewPosition] = React.useState<{ top: number, left: number }>({ top: 50, left: 400 });

	const mtbProps: {
		onMiniChanged?: (isMini: boolean) => void;
		onMaxiClick?: () => void;
		onUpClick?: () => void;
		onActiveStateChanged?: (activeState: ActiveStates) => void;
		isMini?: boolean;
		activeState?: ActiveStates;
	} = {
		onMiniChanged: (mini) => props.onMiniChanged(mini),
		onMaxiClick: () => setIsPreviewFullScreen(true),
		onActiveStateChanged: (activeState) => props.onActiveStateChanged(activeState),
		//isMini: isMini,
		activeState: props.activeState
	}

	const mtbDragItem: DragItem<EditorDNDItemType, IEditorPreviewData> = {
		id: 'mtb',
		type: EditorDNDItemType.preview,
		sourceBhv: 'sGone',
		targetBhv: 'tCopy',
		data: {
			activeState: props.activeState,
			isMini: props.isMini
		}
	}
	const mtbStylableDragItem: StylableDragItemProps<EditorDNDItemType, IEditorPreviewData> = {
		...mtbDragItem,
		isWithDragHandle: true,
		className: 'mtb-dragcontainer',
		dragOrigin: { top: -10, left: -163 },
		isTransitDummy: true
	}

	const createTransitComponents: () => ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = () => {
		const rv: ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = [];
		//Blocks
		const editorTrayItemProps: EditorTrayItemProps = {
			isCompoundBlock: true,
			data: {
				type: 'bdt',
				label: 'TODO'
			},
			isOpen: false,
			onEditBtnPress: () => { },
			onPreviewBtnPress: () => { }
		};
		rv.push({
			forType: EditorDNDItemType.block,
			componentFactory: (dragItem) => (props) => <EditorTrayItem {...editorTrayItemProps}
				data={(props.data as IEditorBlockData)}
			></EditorTrayItem>
		})
		//Minitoolbox
		rv.push({
			forType: EditorDNDItemType.preview,
			componentFactory: (dragItem: DragItem<EditorDNDItemType, IEditorPreviewData>) => (props) => (
				<MTBItemDragContainer {...mtbStylableDragItem}>
					<MiniToolBox
						className='minitoolbox'
						activeState={dragItem.data.activeState}
						isMini={dragItem.data.isMini}
					></MiniToolBox>
				</MTBItemDragContainer>)
		})
		return rv;
	}

	const tabDatas: ITabData<TabTypes>[] = [
		{ data: 'nodeEditor', label: `current compound block: ${props.currentlyEditingItpt}` },
		{ data: 'newNode', label: 'new*' }
	];

	const onTabDrop = (item: DragItem<EditorDNDItemType, (IEditorBlockData)>, left, top) => {
		props.changeNodeCurrentlyEditing(item.data)
	}

	const onMainEditorDrop = (item, left, top) => {
		if (item.type === EditorDNDItemType.preview) {
			setPreviewPosition({ left, top });
		}
		if (item.type == EditorDNDItemType.block) {
			const clientPosition: EditorClientPosition = {clientX: left, clientY: top};
			props.onBlockItemDropped(item, clientPosition);
		}
	}

	//conditional returns
	if (isPreviewFullScreen) {
		return <ITPTFullscreen
			onExitFullscreen={() => setIsPreviewFullScreen(false)}
			ldTokenString={props.previewLDTokenString}
			routes={props.routes} />;
	}
	if (activeTab === 'newNode') {
		return <div className={DND_CLASS}>
			<div className={`${DND_CLASS}-inner`}>
				<Tabs<TabTypes>
					className='editor-tabs'
					selectedIdx={1}
					tabs={tabDatas}
					onSelectionChange={(tabData) => { setActiveTab(tabData.data) }}
				></Tabs>
				<NewItptPanel>
					<NewItptNode onNewBtnClick={(newNameObj) => {
						setActiveTab('nodeEditor');
						props.onNewBtnClick(newNameObj);
					}} />
				</NewItptPanel>
			</div>
		</div>
	}
	return (
		<DNDEnabler
			className={DND_CLASS}
			transitClassName={TRANSIT_CLASS}
			transitComponents={createTransitComponents()}
		>
			{props.children}
			<Tabs<TabTypes>
				className='editor-tabs'
				selectedIdx={0}
				tabs={tabDatas}
				onSelectionChange={(tabData) => {
					setActiveTab(tabData.data);
				}}
			></Tabs>
			<TabDropLayer onDrop={onTabDrop} ></TabDropLayer>
			<MainEditorDropLayer onDrop={onMainEditorDrop}></MainEditorDropLayer>
			<PreviewMoveLayer<EditorDNDItemType>
				{...mtbProps}
				isMini={props.isMini}
				onUpClick={() => props.onUpClick()}
				previewPos={{ left: previewPosition.left, top: previewPosition.top }}
				previewItemType={EditorDNDItemType.preview}>
				<div className="app-content mdscrollbar">
					<BaseContainerRewrite key={props.previewLDTokenString} routes={props.routes} ldTokenString={props.previewLDTokenString} />
				</div>
			</PreviewMoveLayer>
			<div className={`nav-drawer-wrapper ${props.isLeftDrawerActive ? "active" : "inactive"}`}>
				<EditorTray
					itpts={props.trayProps.itpts}
					onEditTrayItem={props.trayProps.onEditTrayItem.bind(this)}
					onZoomAutoLayoutPress={() => props.onZoomAutoLayoutPress()}
				>
					<div className="fakeheader">
						<UserInfo userLabel="John Doe" projectLabel="JohnsPersonalProject" userIconSrc="" />
						{/*
							isGlobal
								? <button style={{ color: "white" }} onClick={() => this.toggleFullScreen.apply(this)}>View in full size FontIconfullscreenFontIcon</button>
								: null
						*/}
					</div>
				</EditorTray>
			</div>
			<SaveStatus {...props.saveStatus} />
		</DNDEnabler>
	)
}