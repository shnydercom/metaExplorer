import { Component } from "react";
import { IconButton } from "react-toolbox/lib/button";

export interface EditorTrayProps {
	model: any;
	color?: string;
	name: string;
	onLongPress: (jsonData) => {};
	isCompoundBlock: boolean;
}

export interface EditorTrayState {
	isOpen: boolean;
}

export class EditorTrayItem extends Component<EditorTrayProps, EditorTrayState> {

	//buttonPressTimer = null;
	constructor(props: EditorTrayProps) {
		super(props);
		//this.handleButtonPress = this.handleButtonPress.bind(this);
		//this.handleButtonRelease = this.handleButtonRelease.bind(this);
		this.state = {
			isOpen: false
		};
	}

	/*handleButtonPress() {
		this.buttonPressTimer = setTimeout(() =>
			this.props.onLongPress(this.props.model), 1500);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}*/

	handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		this.setState({ isOpen: !this.state.isOpen });
	}

	render() {
		let { isOpen } = this.state;
		const { isCompoundBlock } = this.props;
		isOpen = isCompoundBlock ? isOpen : false;
		const trayCssClass = isOpen ? "editor-tray-item opened" : "editor-tray-item";
		const btnCssClass = isOpen ? "load-iconbtn opened" : "load-iconbtn";
		return (
			<div
				style={{ borderColor: this.props.color }}
				onClick={isCompoundBlock ? this.handleClick.bind(this) : () => { return; }}
				//onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}
				draggable={true}
				onDragStart={(event) => {
					//clearTimeout(this.buttonPressTimer);
					event.dataTransfer.setData("ld-node", JSON.stringify(this.props.model));
				}}
				className={trayCssClass}
			>
				{this.props.name}
				<IconButton className={btnCssClass}
					icon={"chevron_right"} onClick={(e) => {
						e.stopPropagation();
						this.props.onLongPress(this.props.model);
					}} />
			</div>
		);
	}
}
