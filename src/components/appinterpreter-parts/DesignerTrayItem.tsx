import * as React from "react";

export interface DesignerTrayProps {
	model: any;
	color?: string;
	name: string;
}

export interface DesignerTrayState {}

export class DesignerTrayItem extends React.Component<DesignerTrayProps, DesignerTrayState> {
	constructor(props: DesignerTrayProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				style={{ borderColor: this.props.color }}
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
