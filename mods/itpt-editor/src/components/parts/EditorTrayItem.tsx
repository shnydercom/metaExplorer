import { useState } from "react";
import { ItemTypes, StylableDragItemProps } from "metaexplorer-react-components";
import { useDrag } from "react-dnd";
import React from "react";
import { IEditorBlockData } from "../editorInterfaces";

export interface EditorTrayProps extends StylableDragItemProps {
	model: IEditorBlockData;
	color?: string;
	name: string;
	onEditBtnPress: (jsonData) => {};
	onPreviewBtnPress: (jsonData) => {};
	isCompoundBlock: boolean;
}

export interface EditorTrayState {
	isOpen: boolean;
}

export const EditorTrayItem: React.FC<EditorTrayProps> = (props) => {

	const [isOpen, setIsOpen] = useState(false);

	// tslint:disable-next-line
	const [{ /*isDragging*/ }, drag, /*preview*/] = useDrag({
		item: { id: props.id, left: props.left, top: props.top, type: ItemTypes.Block, data: props.model },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		}),
	});

	function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		setIsOpen(props.isCompoundBlock ? !isOpen : false);
	}
	const trayCssClass = isOpen ? "editor-tray-item opened" : "editor-tray-item";
	const btnEditCssClass = isOpen ? "edit-iconbtn opened" : "edit-iconbtn";
	const btnPreviewCssClass = isOpen ? "preview-iconbtn opened" : "preview-iconbtn";

	return (
		<div
			ref={drag}
			style={{ borderColor: props.color, left: props.left, top: props.top }}
			onClick={props.isCompoundBlock ? handleClick : () => { return; }}
			onMouseOut={(e) => { if (props.onOutDragHandle) props.onOutDragHandle(); }}
			onMouseEnter={(e) => { if (props.onOverDragHandle) props.onOverDragHandle(); }}
			//onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}
			//draggable={true}
			//onDragStart={(event) => {
			//clearTimeout(this.buttonPressTimer);
			//event.currentTarget.style.backgroundColor = "#ff00ff";
			//event.currentTarget.classList.add("dragging");
			//	event.dataTransfer.setData("ld-node", JSON.stringify(props.model));
			//event.dataTransfer.setDragImage(<img>hallo</img>, 20, 20);
			//}
			//}
			//onDragEnd={
			//	(event) => {
			//event.currentTarget.classList.remove("dragging");
			//	}
			//}
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
};
