import * as React from 'react';
import { DropContainer, StylableDropContainerProps, DragItem } from 'metaexplorer-react-components';
import { EditorDNDItemType, IEditorBlockData } from '../editorInterfaces';

export interface TabDropLayerProps {
	onDrop(item: DragItem<EditorDNDItemType, (IEditorBlockData)>, left: number, top: number);
}

const itptEditorDropContainerProps: StylableDropContainerProps<EditorDNDItemType, (IEditorBlockData )> = {
	onlyAppearOnDrag: true,
	acceptedItemTypes: [EditorDNDItemType.block],
	className: 'editor-tabs-dropcontainer'
}

export function TabDropLayer<TItemType extends string>(props: TabDropLayerProps) {
	return (<DropContainer<EditorDNDItemType, IEditorBlockData> {...itptEditorDropContainerProps}
		onItemDropped={(item, pos) => {
			props.onDrop(item, pos.left, pos.top)}
		}
		style={{ backgroundColor: 'blue', opacity: 0.0 }}
	>

	</DropContainer>)
}