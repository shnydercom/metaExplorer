import * as React from 'react';
import { ITPTFullscreen } from './content/ITPTFullscreen';
import { LDRouteProps } from '@metaexplorer/core';
import { DNDEnabler } from './panels/DNDEnabler';
import { ITransitComp } from 'metaexplorer-react-components';
import { EditorDNDItemType } from './editorInterfaces';
import { DraggableEditorTrayItem } from './content/blockselection/EditorTrayItem';

const DND_CLASS = 'editor'
const TRANSIT_CLASS = 'editor-transit'

export interface EditorMainProps {
	isPreviewFullScreen: boolean;
	previewLDTokenString: string;
	routes: LDRouteProps;
}

export const EditorMain = (props: EditorMainProps) => {

	const [isPreviewFullScreen, setIsPreviewFullScreen] = React.useState<boolean>(props.isPreviewFullScreen)

	const createTransitComponents: () => ITransitComp<EditorDNDItemType>[] = () => {
		const rv: ITransitComp<EditorDNDItemType>[] = [];
		rv.push({
			forType: EditorDNDItemType.block,
			componentFactory: (dragItem) => (props) => <DraggableEditorTrayItem>{dragItem.data.label}</DraggableEditorTrayItem>
		})
		return rv;
	}

	if (isPreviewFullScreen) {
		return <ITPTFullscreen
			onExitFullscreen={() => setIsPreviewFullScreen(false)}
			ldTokenString={props.previewLDTokenString}
			routes={props.routes} />;
	}

	return (
		<DNDEnabler
			className={DND_CLASS}
			transitClassName={TRANSIT_CLASS}
			transitComponents={createTransitComponents()}
		></DNDEnabler>
	)
}