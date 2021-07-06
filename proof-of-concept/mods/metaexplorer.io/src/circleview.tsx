import {ldBlueprint, createLayoutBpCfg, PureLayoutComponent} from "@metaexplorer/core";
import CircleView from 'metaexplorer-react-components/lib/components/circle/circleview';
import React from 'react';

export const LayoutCircleDisplayName = 'metaexplorer.io/layout/circle-display';
@ldBlueprint(createLayoutBpCfg(LayoutCircleDisplayName))
export class PureCircleLayout extends PureLayoutComponent {
	styleClassName = ""; //can be set, default behaviour is centering vertically and horizontally
	render() {
		return <CircleView>{this.renderInputContainer()}</CircleView>;
	}
}
