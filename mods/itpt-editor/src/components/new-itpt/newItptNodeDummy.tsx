import React from "react";

const NEWITPT_NODE_CLASS = "newitpt-node";

const TXT_CREATENEW = "create a new compound block:";
const TXT_USERNAME = "... with a user name";
const TXT_PROJECTNAME = "... a project name";
const TXT_BLOCKNAME = "... and a block Name";
const TXT_BTN_CREATE = "create";

const TXT_SET_ALL_FIELDS = "*all fields must be set";

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

	const [validationMap, setValidationMap] = React.useState<{
		isBlockValid: boolean;
		isProjectValid: boolean;
		isUserNameValid: boolean
	}>({ isBlockValid: true, isProjectValid: true, isUserNameValid: true });

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
		val = { ...val, concatTitle };
		setNewNameObj(val);
	}

	const validateInput = (input: string): boolean => {
		return !!input;
	}

	const handleCreateBtnClick = () => {
		const isAllValid = validateAll();
		if (isAllValid) props.onNewBtnClick(newNameObj)
	}
	const validateAll = () => {
		const lValidationMap = {
			isBlockValid: validateInput(newNameObj.blockName),
			isProjectValid: validateInput(newNameObj.projectName),
			isUserNameValid: validateInput(newNameObj.userName)
		}
		let isMapValid: boolean = true;
		for (const key in lValidationMap) {
			if (lValidationMap.hasOwnProperty(key)) {
				const element = lValidationMap[key];
				if (!element) isMapValid = false;
			}
		}
		setValidationMap(lValidationMap);
		return isMapValid;
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
				<input className={validationMap.isUserNameValid ? '' : 'invalid'}
					onChange={(ev) => {
						setUserName(ev.target.value);
						validateAll();
					}}
					value={newNameObj.userName === TXT_HEADING_USERNAME_PLACEHOLDER ? '' : newNameObj.userName} />
				<span>{TXT_PROJECTNAME}</span>
				<input className={validationMap.isProjectValid ? '' : 'invalid'}
					onChange={(ev) => {
						setProjectName(ev.target.value);
						validateAll();
					}} value={newNameObj.projectName === TXT_HEADING_PROJECT_PLACEHOLDER ? '' : newNameObj.projectName} />
				<span>{TXT_BLOCKNAME}</span>
				<input className={validationMap.isBlockValid ? '' : 'invalid'}
					onChange={(ev) => {
						setBlockName(ev.target.value);
						validateAll();
						}} value={newNameObj.blockName === TXT_HEADING_BLOCK_PLACEHOLDER ? '' : newNameObj.blockName} />
			</div>
			<small className={validationMap.isBlockValid && validationMap.isProjectValid && validationMap.isUserNameValid ? 'validationtxt' : 'validationtxt invalid'}>{TXT_SET_ALL_FIELDS}</small>
			<button
				className='editor-btn editor-btn-confirm confirm-btn' onClick={(e) => {
					e.stopPropagation();
					handleCreateBtnClick();
				}
				}>{TXT_BTN_CREATE}</button>
		</div>
	)
}