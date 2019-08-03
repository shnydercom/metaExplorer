import { useState } from "react";
import { StylableDragItemProps } from "metaexplorer-react-components/lib/components/minitoolbox/dnd/minitoolbox-drag";
import { default as ItemTypes } from "metaexplorer-react-components/lib/components/minitoolbox/dnd/ItemTypes";
import { useDrag } from "react-dnd";
import React from "react";

export interface EditorTrayProps extends StylableDragItemProps {
	model: any;
	color?: string;
	name: string;
	onLongPress: (jsonData) => {};
	isCompoundBlock: boolean;
}

export interface EditorTrayState {
	isOpen: boolean;
}

export const EditorTrayItem: React.FC<EditorTrayProps> = (props) => {

	const [isOpen, setIsOpen] = useState(false);

	// tslint:disable-next-line
	const [{ /*isDragging*/ }, drag, /*preview*/] = useDrag({
		item: { id: props.id, left: props.left, top: props.top, type: ItemTypes.Block },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		}),
	});

	function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		setIsOpen(props.isCompoundBlock ? !isOpen : false);
	}
	const trayCssClass = isOpen ? "editor-tray-item opened" : "editor-tray-item";
	const btnCssClass = isOpen ? "load-iconbtn opened" : "load-iconbtn";
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
			<button className={btnCssClass} onClick={(e) => {
				e.stopPropagation();
				props.onLongPress(props.model);
			}} />
		</div >
	);
};
