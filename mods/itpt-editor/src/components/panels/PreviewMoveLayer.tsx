import * as React from 'react';
import { MoveContainer, DragItem, StylableDragItemProps, DragContainer, MiniToolBox } from 'metaexplorer-react-components';
import { IEditorPreviewData } from '../editorInterfaces';

export interface PreviewMoveLayerProps<TItemType extends string> {
	previewItemType: TItemType;
	previewPos: {
		top: number;
		left: number
	}
}

export function PreviewMoveLayer<TItemType extends string>(props: React.PropsWithChildren<PreviewMoveLayerProps<TItemType>>) {
	const mtbDragItem: DragItem<TItemType, IEditorPreviewData> = {
		id: 'mtb',
		type: props.previewItemType,
		sourceBhv: 'sGone',
		targetBhv: 'tCopy',
		data: {}
	}
	const mtbStylableDragItem: StylableDragItemProps<TItemType, IEditorPreviewData> = {
		...mtbDragItem,
		isWithDragHandle: true,
		className: 'mtb-dragcontainer'
	}
	const MTBItemDragContainer = (props) => {
		return <DragContainer<TItemType, IEditorPreviewData>
			{...mtbStylableDragItem}
		>{props.children}
		</DragContainer >
	}
	return (
		<MoveContainer
			className='editor-movecontainer'
			positionMap={{
				mtb: {
					pos: { top: props.previewPos.top, left: props.previewPos.left },
					child: <MTBItemDragContainer>
							<MiniToolBox className='minitoolbox'>
								{props.children}
							</MiniToolBox>
					</MTBItemDragContainer>
				}
			}}
		/>
	)
}