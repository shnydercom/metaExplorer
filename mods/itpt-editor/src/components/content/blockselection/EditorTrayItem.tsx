import { useState } from "react";
import React from "react";
import { IEditorBlockData, EditorDNDItemType } from "../../editorInterfaces";
import { DragContainer, StylableDragItemProps } from "metaexplorer-react-components";

export interface EditorTrayItemProps {
	model: IEditorBlockData;
	onEditBtnPress: (data) => void;
	onPreviewBtnPress: (data) => void;
	isCompoundBlock: boolean;
}

export interface EditorTrayState {
	isOpen: boolean;
}

export const EditorTrayItem: React.FC<EditorTrayItemProps> = (props) => {

	const [isOpen, setIsOpen] = useState(false);

	function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		setIsOpen(props.isCompoundBlock ? !isOpen : false);
	}
	const trayCssClass = isOpen ? "editor-tray-item opened" : "editor-tray-item";
	const btnEditCssClass = isOpen ? "edit-iconbtn opened" : "edit-iconbtn";
	const btnPreviewCssClass = isOpen ? "preview-iconbtn opened" : "preview-iconbtn";

	const renderContent = () => {
		return (
			<div
				onClick={props.isCompoundBlock ? handleClick : () => { return; }}
				className={trayCssClass}
			>
				{props.model.label}
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
		<>{renderContent()}</>
	)

};

export const DraggableEditorTrayItem: React.FC<EditorTrayItemProps & StylableDragItemProps<EditorDNDItemType, IEditorBlockData>> = (props) => {
	//assigns part of the props to properties of a sub-element https://stackoverflow.com/a/39333479/1149845
	const dragContainerProps: StylableDragItemProps<EditorDNDItemType, IEditorBlockData> =
		(({ className, data, id, isWithDragHandle, onOutDragHandle, onOverDragHandle, sourceBhv, targetBhv, type }) =>
			({ className, data, id, isWithDragHandle, onOutDragHandle, onOverDragHandle, sourceBhv, targetBhv, type }))(props);
	const editorTrayItemProps: EditorTrayItemProps =
		(({ isCompoundBlock, model, onEditBtnPress, onPreviewBtnPress }) =>
			({ isCompoundBlock, model, onEditBtnPress, onPreviewBtnPress }))(props);
	return (<DragContainer<EditorDNDItemType, IEditorBlockData>
		{...dragContainerProps}
	>
		<EditorTrayItem {...editorTrayItemProps}/>
	</DragContainer >)
}
