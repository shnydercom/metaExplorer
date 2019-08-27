import React from "react";

const NEWITPT_NODE_CLASS = "newitpt-node";

const TXT_CREATENEW = "create a new compound node:";
const TXT_USERNAME = "... with a user name";
const TXT_PROJECTNAME = "... a project name";
const TXT_BLOCKNAME = "... and a block Name";
const TXT_BTN_CREATE = "create";

const TXT_HEADING_PLACEHOLDER = "...";
const TXT_HEADING_BLOCK_PLACEHOLDER = "{block}";
const TXT_HEADING_PROJECT_PLACEHOLDER = "{project}";
const TXT_HEADING_USERNAME_PLACEHOLDER = "{user}";

export interface NewItptNodeProps {
	onNewBtnClick: (newNameObj: INewNameObj) => void;
}

export interface INewNameObj {
	blockName: string;
	projectName: string;
	userName: string;
	concatTitle: string;
}

export const NewItptNode = (props: React.PropsWithChildren<NewItptNodeProps>) => {

	const [newNameObj, setNewNameObj] = React.useState<INewNameObj>({
		blockName: '',
		projectName: '',
		userName: '',
		concatTitle: TXT_HEADING_PLACEHOLDER
	})

	const setBlockName = (val: string) => {
		updateTitle({ ...newNameObj, blockName: val });
	}
	const setProjectName = (val: string) => {
		updateTitle({ ...newNameObj, projectName: val });
	}
	const setUserName = (val: string) => {
		updateTitle({ ...newNameObj, userName: val });
	}

	const updateTitle = (val: INewNameObj) => {
		if (!val.blockName && !val.projectName && !val.userName) {
			val.concatTitle = TXT_HEADING_PLACEHOLDER
			setNewNameObj(val);
			return;
		}
		const blockName = val.blockName ? val.blockName : TXT_HEADING_BLOCK_PLACEHOLDER;
		const projectName = val.projectName ? val.projectName : TXT_HEADING_PROJECT_PLACEHOLDER;
		const userName = val.userName ? val.userName : TXT_HEADING_USERNAME_PLACEHOLDER;
		const concatTitle = [userName, projectName, blockName].join('/');
		val = { blockName, concatTitle, projectName, userName };
		setNewNameObj(val);
	}
	return (
		<div className={NEWITPT_NODE_CLASS}>
			<div className='title'>
				<div className='name'>
					{newNameObj.concatTitle}
				</div>
			</div>
			<div className='description'>{TXT_CREATENEW}</div>
			<div className='body'>
				<span>{TXT_USERNAME}</span>
				<input onChange={(ev) => setUserName(ev.target.value)} value={newNameObj.userName === TXT_HEADING_USERNAME_PLACEHOLDER ? '' : newNameObj.userName} />
				<span>{TXT_PROJECTNAME}</span>
				<input onChange={(ev) => setProjectName(ev.target.value)} value={newNameObj.projectName === TXT_HEADING_PROJECT_PLACEHOLDER ? '' : newNameObj.projectName} />
				<span>{TXT_BLOCKNAME}</span>
				<input onChange={(ev) => setBlockName(ev.target.value)} value={newNameObj.blockName === TXT_HEADING_BLOCK_PLACEHOLDER ? '' : newNameObj.blockName} />
			</div>
			<button
				className='editor-btn editor-btn-confirm confirm-btn' onClick={(e) => props.onNewBtnClick(newNameObj)}>{TXT_BTN_CREATE}</button>
		</div>
	)
}