import { Component } from "react";

export interface DesignerTrayProps {
	model: any;
	color?: string;
	name: string;
	onLongPress: (jsonData) => {};
}

export interface DesignerTrayState { }

export class DesignerTrayItem extends Component<DesignerTrayProps, DesignerTrayState> {

	buttonPressTimer = null;
	constructor(props: DesignerTrayProps) {
		super(props);
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);
		this.state = {};
	}

	handleButtonPress() {
		console.log("press");
		this.buttonPressTimer = setTimeout(() =>
			this.props.onLongPress(this.props.model), 1500);
	}

	handleButtonRelease() {
		console.log("release");
		clearTimeout(this.buttonPressTimer);
	}

	render() {
		return (
			<div
				style={{ borderColor: this.props.color }}
				onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}
				draggable={true}
				onDragStart={(event) => {
					console.log("drag start");
					clearTimeout(this.buttonPressTimer);
					event.dataTransfer.setData("ld-node", JSON.stringify(this.props.model));
				}}
				className="designer-tray-item"
			>
				{this.props.name}
			</div>
		);
	}
}
