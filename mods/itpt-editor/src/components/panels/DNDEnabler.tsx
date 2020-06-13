import * as React from 'react';
import { TransitComponent, ITransitComp, StylableTransitComponentProps } from 'metaexplorer-react-components';

import MultiBackend from 'react-dnd-multi-backend';
//those are options:
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

//import HTML5Backend from 'react-dnd-html5-backend';
//import TouchBackend from 'react-dnd-touch-backend';

import { DndProvider } from 'react-dnd';
import { IEditorPreviewData, IEditorBlockData } from '../editorInterfaces';

const DNDBackend = MultiBackend;

const TRANSIT_CLASS = 'editor-transit';

export interface DNDEnablerProps<TItemType extends string> {
	className: string;
	transitClassName: string;
	transitComponents: Array<ITransitComp<TItemType, (IEditorPreviewData | IEditorBlockData)>>;
}

export function DNDEnabler<TItemType extends string>(props: React.PropsWithChildren<DNDEnablerProps<TItemType>>) {

	const transitCompProps: StylableTransitComponentProps<TItemType, (IEditorPreviewData | IEditorBlockData)> = {
		className: TRANSIT_CLASS,
		transitComponents: props.transitComponents
	}
	return (
		<div className={props.className}>
			<DndProvider backend={DNDBackend} options={HTML5toTouch}>
				<div className={`${props.className}-inner`}>
					{props.children}
					<TransitComponent {...transitCompProps} />
				</div>
			</DndProvider>
		</div>
	)
}