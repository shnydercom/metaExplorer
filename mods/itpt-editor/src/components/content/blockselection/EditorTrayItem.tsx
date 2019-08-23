import { useState } from "react";
import React from "react";
import { IEditorBlockData, EditorDNDItemType } from "../../editorInterfaces";
import { DragContainer, StylableDragItemProps } from "metaexplorer-react-components";

export interface EditorTrayItemProps {
	data: IEditorBlockData;
	onEditBtnPress: (data) => void;
	onPreviewBtnPress: (data) => void;
	isCompoundBlock: boolean;
	isOpen: boolean;
	onClick?: () => void;
}

export interface EditorTrayState {
}

export const EditorTrayItem: React.FC<EditorTrayItemProps> = (props) => {

	const trayCssClass = props.isOpen ? "editor-tray-item opened" : "editor-tray-item";
	const btnEditCssClass = props.isOpen ? "edit-iconbtn opened" : "edit-iconbtn";
	const btnPreviewCssClass = props.isOpen ? "preview-iconbtn opened" : "preview-iconbtn";

	const renderContent = () => {
		return (
			<div
				onClick={props.isCompoundBlock ? () => props.onClick() : () => { return; }}
				className={trayCssClass}
			>
				{props.data.label}
				<button className={btnEditCssClass} onClick={(e) => {
					e.stopPropagation();
					props.onEditBtnPress(props.data);
				}} >edit</button>
				<button className={btnPreviewCssClass} onClick={(e) => {
					e.stopPropagation();
					props.onPreviewBtnPress(props.data);
				}} >preview</button>
			</div >
		);
	}

	return (
		<>{renderContent()}</>
	)

};

export const DraggableEditorTrayItem: React.FC<EditorTrayItemProps & StylableDragItemProps<EditorDNDItemType, IEditorBlockData>> = (props) => {

	const [isOpen, setIsOpen] = useState(false);
	function handleClick() {
		setIsOpen(props.isCompoundBlock ? !isOpen : false);
	}
	//assigns part of the props to properties of a sub-element https://stackoverflow.com/a/39333479/1149845
	const dragContainerProps: StylableDragItemProps<EditorDNDItemType, IEditorBlockData> =
		(({ className, data, id, isWithDragHandle, onOutDragHandle, onOverDragHandle, sourceBhv, targetBhv, type }) =>
			({ className, data, id, isWithDragHandle, onOutDragHandle, onOverDragHandle, sourceBhv, targetBhv, type }))(props);
	const editorTrayItemProps: EditorTrayItemProps =
		(({ isCompoundBlock, data, onEditBtnPress, onPreviewBtnPress, isOpen, onClick }) =>
			({ isCompoundBlock, data, onEditBtnPress, onPreviewBtnPress, isOpen, onClick }))(props);
	editorTrayItemProps.isOpen = isOpen;
	if (editorTrayItemProps.onClick) {
		editorTrayItemProps.onClick = () => {
			handleClick();
			props.onClick()
		}
	} else {
		editorTrayItemProps.onClick = handleClick;
	}
	return (<DragContainer<EditorDNDItemType, IEditorBlockData>
		{...dragContainerProps}
	>
		<EditorTrayItem {...editorTrayItemProps} />
	</DragContainer >)
}
