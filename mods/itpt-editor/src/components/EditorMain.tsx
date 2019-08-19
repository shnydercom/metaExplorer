import * as React from 'react';
import { ITPTFullscreen } from './content/ITPTFullscreen';
import { LDRouteProps } from '@metaexplorer/core';
import { ITabData, Tabs } from 'metaexplorer-react-components';
/*import { ITransitComp, MiniToolBox } from 'metaexplorer-react-components';
import { EditorDNDItemType, IEditorBlockData, IEditorPreviewData } from './editorInterfaces';
import { EditorTrayItem, EditorTrayItemProps } from './content/blockselection/EditorTrayItem';
import { PreviewMoveLayer } from './panels/PreviewMoveLayer';

import { DNDEnabler } from './panels/DNDEnabler';
const DND_CLASS = 'editor'
const TRANSIT_CLASS = 'editor-transit'*/

export interface EditorMainProps {
	isPreviewFullScreen: boolean;
	previewLDTokenString: string;
	routes: LDRouteProps;
}

export const EditorMain = (props: React.PropsWithChildren<EditorMainProps>) => {

	const [isPreviewFullScreen, setIsPreviewFullScreen] = React.useState<boolean>(props.isPreviewFullScreen)

	/*const createTransitComponents: () => ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = () => {
		const rv: ITransitComp<EditorDNDItemType, (IEditorBlockData | IEditorPreviewData)>[] = [];
		//Blocks
		const editorTrayItemProps: EditorTrayItemProps = { 
			isCompoundBlock: true, 
			model: {
				type: 'TODO',
				label: 'TODO'
			}, 
			onEditBtnPress: () => {}, 
			onPreviewBtnPress: () => {} 
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
	}*/

	if (isPreviewFullScreen) {
		return <ITPTFullscreen
			onExitFullscreen={() => setIsPreviewFullScreen(false)}
			ldTokenString={props.previewLDTokenString}
			routes={props.routes} />;
	}
	const tabDatas: ITabData<string>[] = [
		{ data: 'Elem1', label: 'first Element' },
		{ data: 'Elem2', label: 'second Element' },
		{ data: 'Elem3', label: 'third Element' },
		{ data: 'Elem4', label: 'fourth Element' },
		{ data: 'Elem5', label: 'fifth Element' },
		{ data: 'Elem6', label: 'sixth Element' }
	];

	return (
		<div><Tabs
		className='editor-tabs'
		selectedIdx={ 0}
		tabs={tabDatas}
	></Tabs>
		{/*
		<DNDEnabler
			className={DND_CLASS}
			transitClassName={TRANSIT_CLASS}
			transitComponents={createTransitComponents()}
		>
			<PreviewMoveLayer<EditorDNDItemType> previewItemType={EditorDNDItemType.preview}></PreviewMoveLayer>
			{props.children}
	</DNDEnabler>*/}</div>
	)
}