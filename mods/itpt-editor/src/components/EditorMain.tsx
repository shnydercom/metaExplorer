import * as React from 'react';
import { ITPTFullscreen } from './content/ITPTFullscreen';
import { LDRouteProps, BaseContainerRewrite } from '@metaexplorer/core';
import { ITransitComp, ITabData, Tabs, MiniToolBox, DragItem } from 'metaexplorer-react-components';
import { EditorDNDItemType, IEditorBlockData, IEditorPreviewData } from './editorInterfaces';
import { EditorTrayItem, EditorTrayItemProps } from './content/blockselection/EditorTrayItem';
import { PreviewMoveLayer } from './panels/PreviewMoveLayer';

import { DNDEnabler } from './panels/DNDEnabler';
import { MainEditorDropLayer } from './panels/MainEditorDropLayer';
import { EditorTrayProps, EditorTray } from './content/blockselection/EditorTray';
import { UserInfo } from './content/status/UserInfo';
import { TabDropLayer } from './panels/TabDropLayer';
import { NewItptPanel } from './new-itpt/newItptPanel';
import { NewItptNode, INewNameObj } from './new-itpt/newItptNodeDummy';
import { ISaveStatusProps, SaveStatus } from './content/status/SaveStatus';
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
	onBlockItemDropped: (blockItem: DragItem<EditorDNDItemType, IEditorBlockData>) => void;
	changeNodeCurrentlyEditing(data: IEditorBlockData): {};
	onNewBtnClick: (newNameObj: INewNameObj) => void;
	saveStatus: ISaveStatusProps;
}

type TabTypes = "nodeEditor" | "newNode";

export const EditorMain = (props: React.PropsWithChildren<EditorMainProps>) => {

	const [activeTab, setActiveTab] = React.useState<TabTypes>("nodeEditor")

	const [isPreviewFullScreen, setIsPreviewFullScreen] = React.useState<boolean>(props.isPreviewFullScreen)

	const [previewPosition, setPreviewPosition] = React.useState<{ top: number, left: number }>({ top: 20, left: 200 });

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
			componentFactory: (dragItem) => (props) => (<MiniToolBox className='minitoolbox'></MiniToolBox>)
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
			props.onBlockItemDropped(item);
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
					}}/>
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
					console.log("called onSelChange")
					setActiveTab(tabData.data);
				}}
			></Tabs>
			<TabDropLayer onDrop={onTabDrop} ></TabDropLayer>
			<MainEditorDropLayer onDrop={onMainEditorDrop}></MainEditorDropLayer>
			<PreviewMoveLayer<EditorDNDItemType>
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
			<SaveStatus {...props.saveStatus}/>
		</DNDEnabler>
	)
}