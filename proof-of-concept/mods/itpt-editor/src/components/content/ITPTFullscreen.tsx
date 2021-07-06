import * as React from 'react';
import { BaseContainerRewrite, LDRouteProps } from '@metaexplorer/core';

const TXT_EDIT = "edit";

export interface ITPTFullscreenProps {
	routes: LDRouteProps;
	ldTokenString: string;
	onExitFullscreen: () => void;
}

export const ITPTFullscreen = (props: ITPTFullscreenProps) => {
	return (<div className="app-actual app-content">
		<BaseContainerRewrite key={`${props.ldTokenString}-fs`} routes={props.routes} ldTokenString={props.ldTokenString} />
		<div className="mode-switcher">
			<button className="editor-btn editor-btn-confirm editor-btn-fstoggle" onClick={() => props.onExitFullscreen()}>{TXT_EDIT}</button>
		</div>
	</div>
	);
}
