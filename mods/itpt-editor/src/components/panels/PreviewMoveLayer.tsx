import * as React from 'react';
import { MoveContainer, DragItem, StylableDragItemProps, DragContainer, MiniToolBox, ActiveStates } from 'metaexplorer-react-components';
import { IEditorPreviewData } from '../editorInterfaces';

export interface PreviewMoveLayerProps<TItemType extends string> {
	previewItemType: TItemType;
	previewPos: {
		top: number;
		left: number
	}
	onMiniChanged?: (isMini: boolean) => void;
	onMaxiClick?: () => void;
	onUpClick?: () => void;
	onActiveStateChanged?: (activeState: ActiveStates) => void;
	isMini?: boolean;
	activeState?: ActiveStates;
}

export function PreviewMoveLayer<TItemType extends string>(props: React.PropsWithChildren<PreviewMoveLayerProps<TItemType>>) {
	const mtbDragItem: DragItem<TItemType, IEditorPreviewData> = {
		id: 'mtb',
		type: props.previewItemType,
		sourceBhv: 'sGone',
		targetBhv: 'tCopy',
		data: {
			activeState: props.activeState,
			isMini: props.isMini
		}
	}
	const mtbStylableDragItem: StylableDragItemProps<TItemType, IEditorPreviewData> = {
		...mtbDragItem,
		isWithDragHandle: true,
		className: 'mtb-dragcontainer',
		dragOrigin: { top: -10, left: -163}
	}

	return (
		<MoveContainer
			className='editor-movecontainer'
			positionMap={{
				mtb: {
					pos: { top: props.previewPos.top, left: props.previewPos.left },
					child: <MTBItemDragContainer {...mtbStylableDragItem}>
						<MiniToolBox
							className='minitoolbox'
							onMiniChanged={props.onMiniChanged}
							onMaxiClick={props.onMaxiClick}
							onUpClick={props.onUpClick}
							onActiveStateChanged={props.onActiveStateChanged}
							isMini={props.isMini}
							activeState={props.activeState}
						>
							{props.children}
						</MiniToolBox>
					</MTBItemDragContainer>
				}
			}}
		/>
	)
}

export function MTBItemDragContainer<TItemType extends string>(props: StylableDragItemProps<TItemType, IEditorPreviewData>) {
	return <DragContainer<TItemType, IEditorPreviewData>
		{...props}
	>
	</DragContainer >
}