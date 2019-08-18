import * as React from 'react';
import { MoveContainer, DragItem, StylableDragItemProps, DragContainer, MiniToolBox } from 'metaexplorer-react-components';

export interface PreviewMoveLayerProps<TItemType extends string> {
	previewItemType: TItemType;
}

export function PreviewMoveLayer<TItemType extends string>(props: React.PropsWithChildren<PreviewMoveLayerProps<TItemType>>) {
	const mtbDragItem: DragItem<TItemType> = {
		id: 'mtb',
		type: props.previewItemType,
		sourceBhv: 'sGone',
		targetBhv: 'tCopy'
	}
	const mtbStylableDragItem: StylableDragItemProps<TItemType> = {
		...mtbDragItem,
		isWithDragHandle: true,
		className: 'mtb-dragcontainer'
	}
	const MTBItemDragContainer = (props) => {
		return <DragContainer<TItemType>
			{...mtbStylableDragItem}
		>
			<div>{props.children}</div>
		</DragContainer >
	}
	return (
		<MoveContainer
			className='editor-movecontainer'
			positionMap={{
				mtb: {
					pos: { top: 20, left: 200 },
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