import { Component } from "react";

export interface DropRefmapResult {
	isSuccess: boolean;
	message: string;
}

export interface RefMapDropSpaceProps {
	dropText: string;
	refMapDrop: (event: React.DragEvent<HTMLDivElement>) => DropRefmapResult;
}

export interface RefMapDropSpaceState {
	message: string;
}

export class RefMapDropSpace extends Component<RefMapDropSpaceProps, RefMapDropSpaceState> {
	constructor(props: RefMapDropSpaceProps) {
		super(props);
		this.state = {
			message: ''
		};
	}

	render() {
		return (
			<div className="refmap-drop-outer">
				<div
					onDrop={(event) => {
						let dropResult = this.props.refMapDrop(event);
						this.setState({message: `isSuccess: ${dropResult.isSuccess} message: ${dropResult.message}`});
					}}
					onDragOver={(event) => {
						event.preventDefault();
					}}
					className="refmap-drop-inner"
				>
					{this.props.dropText}
					{this.state.message}
				</div>
			</div>
		);
	}
}
