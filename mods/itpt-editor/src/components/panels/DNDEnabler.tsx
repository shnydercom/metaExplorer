import * as React from 'react';
import { TransitComponent, ITransitComp, StylableTransitComponentProps } from 'metaexplorer-react-components';

import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const DNDBackend = HTML5Backend;

const TRANSIT_CLASS = 'editor-transit';

export interface DNDEnablerProps<TItemType extends string> {
	className: string;
	transitClassName: string;
	transitComponents: ITransitComp<TItemType>[];
}

export function DNDEnabler<TItemType extends string>(props: React.PropsWithChildren<DNDEnablerProps<TItemType>>) {

	const transitCompProps: StylableTransitComponentProps<TItemType> = {
		className: TRANSIT_CLASS,
		transitComponents: props.transitComponents
	}
	return (
		<div className={props.className}>
			<DndProvider backend={DNDBackend}>
				<div className={`${props.className}-inner`}>
					{props.children}
					<TransitComponent {...transitCompProps} />
				</div>
			</DndProvider>
		</div>
	)
}