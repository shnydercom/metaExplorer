import { Component } from "react";

export interface EditorTrayProps {
	model: any;
	color?: string;
	name: string;
	onLongPress: (jsonData) => {};
}

export interface EditorTrayState { }

export class EditorTrayItem extends Component<EditorTrayProps, EditorTrayState> {

	buttonPressTimer = null;
	constructor(props: EditorTrayProps) {
		super(props);
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);
		this.state = {};
	}

	handleButtonPress() {
		this.buttonPressTimer = setTimeout(() =>
			this.props.onLongPress(this.props.model), 1500);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}

	render() {
		return (
			<div
				style={{ borderColor: this.props.color }}
				onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}
				draggable={true}
				onDragStart={(event) => {
					clearTimeout(this.buttonPressTimer);
					event.dataTransfer.setData("ld-node", JSON.stringify(this.props.model));
				}}
				className="editor-tray-item"
			>
				{this.props.name}
			</div>
		);
	}
}
