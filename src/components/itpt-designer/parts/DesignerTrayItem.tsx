import { Component } from "react";

export interface DesignerTrayProps {
	model: any;
	color?: string;
	name: string;
	onDoubleClick: (jsonData) => {};
}

export interface DesignerTrayState {}

export class DesignerTrayItem extends Component<DesignerTrayProps, DesignerTrayState> {
	constructor(props: DesignerTrayProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				style={{ borderColor: this.props.color }}
				onDoubleClick={() => {
					this.props.onDoubleClick(this.props.model);
				}}
				draggable={true}
				onDragStart={(event) => {
					event.dataTransfer.setData("ld-node", JSON.stringify(this.props.model));
				}}
				className="designer-tray-item"
			>
				{this.props.name}
			</div>
		);
	}
}
