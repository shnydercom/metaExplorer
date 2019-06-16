import ldBlueprint, { } from 'ldaccess/ldBlueprint';

import { AbstractNavBarWActions, NavBarWActionsBpCfg } from 'components/essentials/navigation/AbstractNavBarWActions';
import { AppBar, Toolbar, IconButton, Typography, Popover } from '@material-ui/core';
import { VisualKeysDict } from 'components/visualcomposition/visualDict';
import { classNamesLD } from 'components/reactUtils/compUtilFns';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
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

	protected handleClose() {
		this.setState({ ...this.state, isRightMenuOpen: false, anchor: null });
	}

	protected onTriggerOpenRightMenu(evt) {
		this.setState({ ...this.state, isRightMenuOpen: true, anchor: evt.currentTarget });
	}
	protected renderCore() {
		const { localValues, isRightMenuOpen, anchor, compInfos } = this.state;
		const headerText = localValues.get(VisualKeysDict.headerTxt);
		const hasPopOverContent = compInfos.has(VisualKeysDict.popOverContent);
		const id = isRightMenuOpen ? 'simple-popover' : null;
		let routeSendCancel = localValues.get(VisualKeysDict.routeSend_cancel);
		const routeSendSearch = localValues.get(VisualKeysDict.routeSend_search);
		return <>
			<AppBar position="static"
				className={classNamesLD(null, localValues)}
			>
				<Toolbar>
					{routeSendCancel
						? <IconButton edge="start" color="inherit" aria-label="Menu"
							onClick={() => this.onCancelClick()}>
							<ArrowBackIcon />
						</IconButton>
						: null}
					<Typography variant="h6">
						{headerText ? headerText : "Menu"}
					</Typography>
					{routeSendSearch
						? <IconButton onClick={this.onAppBarSearchBtnClick}><SearchIcon /></IconButton>
						: null}
					{hasPopOverContent
						? <IconButton edge="end" aria-label="additional actions" color="inherit"
							onClick={(evt) => this.onTriggerOpenRightMenu(evt)}
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
	}
}
