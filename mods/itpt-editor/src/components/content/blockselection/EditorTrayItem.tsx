import { useState } from "react";
import React from "react";
import { IEditorBlockData } from "../../editorInterfaces";

export interface EditorTrayProps {
	model: IEditorBlockData;
	color?: string;
	name: string;
	onEditBtnPress: (data) => void;
	onPreviewBtnPress: (data) => void;
	isCompoundBlock: boolean;
}

export interface EditorTrayState {
	isOpen: boolean;
}

export const EditorTrayItem: React.FC<EditorTrayProps> = (props) => {

	const [isOpen, setIsOpen] = useState(false);

	function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		setIsOpen(props.isCompoundBlock ? !isOpen : false);
	}
	const trayCssClass = isOpen ? "editor-tray-item opened" : "editor-tray-item";
	const btnEditCssClass = isOpen ? "edit-iconbtn opened" : "edit-iconbtn";
	const btnPreviewCssClass = isOpen ? "preview-iconbtn opened" : "preview-iconbtn";

	const renderContent = (isDragLayer: boolean) => {
		return (
			<div
				style={{ borderColor: props.color }}
				onClick={props.isCompoundBlock ? handleClick : () => { return; }}
				className={trayCssClass}
			>
				{props.name}
				{/**
						icon={"chevron_right"} */}
				<button className={btnEditCssClass} onClick={(e) => {
					e.stopPropagation();
					props.onEditBtnPress(props.model);
				}} >edit</button>
				<button className={btnPreviewCssClass} onClick={(e) => {
					e.stopPropagation();
					props.onPreviewBtnPress(props.model);
				}} >preview</button>
			</div >
		);
	}

	return (
		<>{renderContent(false)}</>
	)

};
