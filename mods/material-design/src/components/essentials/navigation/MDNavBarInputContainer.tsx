import {ldBlueprint, NavBarInputContainerBpCfg, AbstractNavBarInputContainer, classNamesLD, VisualKeysDict} from '@metaexplorer/core';
import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';

@ldBlueprint(NavBarInputContainerBpCfg)
export class MDNavBarInputContainer extends AbstractNavBarInputContainer {

	render() {
		const { compInfos, localValues } = this.state;
		const hasPrimaryContent = compInfos.has(VisualKeysDict.primaryItpt);
		return <>
			<AppBar position="static"
				className={classNamesLD(null, localValues)}
			>
				<Toolbar>
					{hasPrimaryContent
						? <>{this.renderSub(VisualKeysDict.primaryItpt)}</>
						: null}
				</Toolbar>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;
		/*<>
			<AppBar className={classNamesLD("full-navbar", localValues)}>
				<Navigation type='horizontal'>
					{hasPrimaryContent
						? <>{this.renderSub(VisualKeysDict.primaryItpt)}</>
						: null}
				</Navigation>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;*/
	}
}
