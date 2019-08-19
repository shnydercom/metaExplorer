import * as React from 'react';
import { BaseContainerRewrite, LDRouteProps } from '@metaexplorer/core';

export interface ITPTFullscreenProps {
	routes: LDRouteProps;
	ldTokenString: string;
	onExitFullscreen: () => void;
}

export const ITPTFullscreen = (props: ITPTFullscreenProps) => {
	return (<div className="app-actual app-content">
		<BaseContainerRewrite routes={props.routes} ldTokenString={props.ldTokenString} />
		<div className="mode-switcher">
			<button className="editor-switch-btn" onClick={() => props.onExitFullscreen()} />
		</div>
	</div>
	);
}
