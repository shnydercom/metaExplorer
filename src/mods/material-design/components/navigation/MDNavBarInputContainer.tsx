import ldBlueprint, {  } from 'ldaccess/ldBlueprint';

import { NavBarInputContainerBpCfg, AbstractNavBarInputContainer } from 'components/md/navigation/AbstractNavBarInputContainer';

@ldBlueprint(NavBarInputContainerBpCfg)
export class MDNavBarInputContainer extends AbstractNavBarInputContainer {

	render() {
		const {  compInfos } = this.state;
		return <div>NavBarInputContainer</div>;
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
