import ldBlueprint, { } from 'ldaccess/ldBlueprint';

import { NavBarInputContainerBpCfg, AbstractNavBarInputContainer } from 'components/essentials/navigation/AbstractNavBarInputContainer';
import { AppBar, Toolbar } from '@material-ui/core';
import { classNamesLD } from 'components/reactUtils/compUtilFns';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';

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
