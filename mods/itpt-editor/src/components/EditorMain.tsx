import * as React from 'react';
import { ITPTFullscreen } from './content/ITPTFullscreen';
import { LDRouteProps } from '@metaexplorer/core';
import { ITransitComp, ITabData, Tabs, MiniToolBox } from 'metaexplorer-react-components';
import { EditorDNDItemType, IEditorBlockData, IEditorPreviewData } from './editorInterfaces';
import { EditorTrayItem, EditorTrayItemProps } from './content/blockselection/EditorTrayItem';
import { PreviewMoveLayer } from './panels/PreviewMoveLayer';

import { DNDEnabler } from './panels/DNDEnabler';
import { MainEditorDropLayer } from './panels/MainEditorDropLayer';
import { EditorTrayProps, EditorTray } from './content/blockselection/EditorTray';
import { UserInfo } from './content/status/UserInfo';
const DND_CLASS = 'entrypoint-editor'
const TRANSIT_CLASS = 'editor-transit'

export interface EditorMainProps {
	isPreviewFullScreen: boolean;
	previewLDTokenString: string;
	routes: LDRouteProps;
	trayProps: EditorTrayProps;
	isLeftDrawerActive: boolean;
}

export const EditorMain = (props: React.PropsWithChildren<EditorMainProps>) => {

	const [isPreviewFullScreen, setIsPreviewFullScreen] = React.useState<boolean>(props.isPreviewFullScreen)

	const [previewPosition, setPreviewPosition] = React.useState<{ top: number, left: number }>({ top: 20, left: 200 });

	const createTransitComponents: () => ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = () => {
		const rv: ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = [];
		//Blocks
		const editorTrayItemProps: EditorTrayItemProps = {
			isCompoundBlock: true,
			model: {
				type: 'TODO',
				label: 'TODO'
			},
			isOpen: false,
			onEditBtnPress: () => { },
			onPreviewBtnPress: () => { }
		};
		rv.push({
			forType: EditorDNDItemType.block,
			componentFactory: (dragItem) => (props) => <EditorTrayItem {...editorTrayItemProps}
			>{(dragItem.data as IEditorBlockData).label}</EditorTrayItem>
		})
		//Minitoolbox
		rv.push({
			forType: EditorDNDItemType.preview,
			componentFactory: (dragItem) => (props) => (<MiniToolBox className='minitoolbox'></MiniToolBox>)
		})
		return rv;
	}

	if (isPreviewFullScreen) {
		return <ITPTFullscreen
			onExitFullscreen={() => setIsPreviewFullScreen(false)}
			ldTokenString={props.previewLDTokenString}
			routes={props.routes} />;
	}
	const tabDatas: ITabData<string>[] = [
		{ data: 'Elem1', label: 'currently editing' },
		{ data: 'newElem', label: 'new*' }
	];

	const onMainEditorDrop = (item, left, top) => {
		console.log(item)
		console.log(left)
		if (item.type === EditorDNDItemType.preview)
			setPreviewPosition({ left, top });
	}
	return (
		<DNDEnabler
			className={DND_CLASS}
			transitClassName={TRANSIT_CLASS}
			transitComponents={createTransitComponents()}
		>
			<Tabs
				className='editor-tabs'
				selectedIdx={0}
				tabs={tabDatas}
			></Tabs>
			<MainEditorDropLayer onDrop={onMainEditorDrop}></MainEditorDropLayer>
			<PreviewMoveLayer<EditorDNDItemType>
				previewPos={{ left: previewPosition.left, top: previewPosition.top }}
				previewItemType={EditorDNDItemType.preview}></PreviewMoveLayer>
			<div className={`nav-drawer-wrapper ${props.isLeftDrawerActive ? "active" : "inactive"}`}>
				<EditorTray
					itpts={props.trayProps.itpts}
					onEditTrayItem={props.trayProps.onEditTrayItem.bind(this)}
					onZoomAutoLayoutPress={() => {
						this.logic.autoDistribute();
						this.diagramRef.current.forceUpdate();
					}}
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
			{props.children}
		</DNDEnabler>
	)
}