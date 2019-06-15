import ldBlueprint, { } from 'ldaccess/ldBlueprint';

import { AbstractNavBarWActions, NavBarWActionsBpCfg } from 'components/essentials/navigation/AbstractNavBarWActions';
import { AppBar, Toolbar, IconButton, Typography, Popover, withStyles } from '@material-ui/core';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { classNamesLD } from 'components/reactUtils/compUtilFns';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';

/*
TODOs:
-	dynamic icons for front and back button
- theming
*/

interface IAnchorState {
	anchor: any;
}

@ldBlueprint(NavBarWActionsBpCfg)
export class MDNavBarWActions extends AbstractNavBarWActions<IAnchorState> {

	constructor(props?: LDConnectedState & LDConnectedDispatch & LDOwnProps) {
		super(props, { anchor: null });
	}

	protected handleClick(event) {
		this.setState({ ...this.state, anchor: event.currentTarget });
	}

	protected handleClose() {
		this.setState({ ...this.state, isRightMenuOpen: false, anchor: null });
	}

	protected onTriggerOpenRightMenu() {
		this.setState({ ...this.state, isRightMenuOpen: true });
	}
	protected renderCore() {
		const { localValues, isRightMenuOpen, anchor } = this.state;
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const routeSendSearch = localValues.get(VisualKeysDict.routeSend_search);
		const id = isRightMenuOpen ? 'simple-popover' : null;
		return <>
			<AppBar position="static"
				className={classNamesLD(null, localValues)}
			>
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="Menu"
						onClick={() => this.onCancelClick()}>
						<ArrowBackIcon />
					</IconButton>
					<Typography variant="h6">
						{headerText ? headerText : "Menu"}
					</Typography>
					{routeSendSearch
						? <IconButton edge="end" aria-label="additional actions" color="inherit"
							onClick={() => this.onTriggerOpenRightMenu()}
						><MoreVertIcon /></IconButton> // TODO: interpret font icon
						: null}
				</Toolbar>
			</AppBar>
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
			<Popover
				id={id}
				open={isRightMenuOpen}
				anchorEl={anchor}
				onClose={() => this.handleClose()}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<div className="menu-pop-over">{this.renderSub(VisualKeysDict.popOverContent)}</div>
			</Popover>
		</>;

		/*
		<>
			<AppBar title={headerText ? headerText : "Menu"}
				leftIcon={routeSendCancel ? "arrow_back" : null} // TODO: MD
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
			//DONE
			<div className="bottom-nav-topfree mdscrollbar">
				{this.renderSub(VisualKeysDict.inputContainer)}
			</div>
		</>;*/
	}
}
