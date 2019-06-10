import ldBlueprint, {  } from 'ldaccess/ldBlueprint';

import { AbstractNavBarWActions, NavBarWActionsBpCfg } from 'components/md/navigation/AbstractNavBarWActions';
@ldBlueprint(NavBarWActionsBpCfg)
export class MDNavBarWActions extends AbstractNavBarWActions {

	protected renderCore() {
		return <div>NavBarWActions</div>;
		/*

		<>
			<AppBar title={headerText ? headerText : "Menu"}
				leftIcon={routeSendCancel ? "arrow_back" : null}
				onLeftIconClick={() => this.onCancelClick()}
				className={classNamesLD(null, localValues)}
			>
				<Navigation type='horizontal'>
					{routeSendSearch
						? <IconButton icon='search' onClick={this.onAppBarSearchBtnClick} />
						: null}
					{hasPopOverContent
						? <IconMenu icon={iconName ? iconName : 'account_circle'} position='topRight' menuRipple onClick={this.onAppBarRightIconMenuClick}>
							<div className="menu-pop-over">{this.renderSub(VisualKeysDict.popOverContent)}</div>
						</IconMenu>
						: null}
				</Navigation>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;*/
	}
}
