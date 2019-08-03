import {ldBlueprint, AbstractNavBarWActions, NavBarWActionsBpCfg, VisualKeysDict
, classNamesLD, LDConnectedState, LDConnectedDispatch, LDOwnProps } from '@metaexplorer/core';
import { AppBar, Toolbar, IconButton, Typography, Popover, makeStyles, Theme } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles } from '@material-ui/styles';
import React from 'react';

/*
TODOs:
-	dynamic icons for front and back button
- theming
*/

interface IAnchorState {
	anchor: any;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
		},
		searchbtn: {
			//marginRight: theme.spacing(2),
		},
		popoverbtn: {
			//marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	}),
);

interface IStyledAppBarProps {
	localValues: any;
	routeSendCancel: any;
	headerText: any;
	routeSendSearch: any;
	hasPopOverContent: any;
	onCancelClick: () => void;
	onTriggerOpenRightMenu: (evt) => void;
}

const StyledAppBar: React.SFC<IStyledAppBarProps> = (props) => {
	const classes = useStyles(props);
	const { localValues,
		routeSendCancel,
		headerText,
		routeSendSearch,
		hasPopOverContent,
		onCancelClick,
		onTriggerOpenRightMenu } = props;
	return (
		<>
			<AppBar position="static"
				className={`${classNamesLD(null, localValues)} ${classes.root}`}
			>
				<Toolbar>
					{routeSendCancel
						? <IconButton edge="start" color="inherit" aria-label="Menu"
							onClick={() => onCancelClick()}>
							<ArrowBackIcon />
						</IconButton>
						: null}
					<Typography variant="h6" className={classes.title}>
						{headerText ? headerText : "Menu"}
					</Typography>
					{routeSendSearch
						? <IconButton className={classes.searchbtn} onClick={this.onAppBarSearchBtnClick}><SearchIcon /></IconButton>
						: null}
					{hasPopOverContent
						? <IconButton edge="end" className={classes.popoverbtn} aria-label="additional actions" color="inherit"
							onClick={(evt) => onTriggerOpenRightMenu(evt)}
						><MoreVertIcon /></IconButton> // TODO: interpret font icon
						: null}
				</Toolbar>
			</AppBar>
		</>
	);
};

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
		const styledAppBarProps: IStyledAppBarProps = {
			localValues,
			routeSendCancel,
			headerText,
			routeSendSearch,
			hasPopOverContent,
			onCancelClick: this.onCancelClick.bind(this),
			onTriggerOpenRightMenu: this.onTriggerOpenRightMenu.bind(this)
		};
		return <>
			<StyledAppBar {...styledAppBarProps} />
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
