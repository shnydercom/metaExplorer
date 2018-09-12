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
						this.setState({ message: `${dropResult.message}` });
					}}
					onDragOver={(event) => {
						event.preventDefault();
					}}
					className="refmap-drop-inner"
				>
					{!this.state.message ? this.props.dropText : '...dropped!...'}
					{this.state.message ? <><br/><br/>{this.state.message}</> : null}
				</div>
			</div>
		);
	}
}
