import { Component } from "react";

//const TooltipDiv = tooltipFactory({ passthrough: false })(({children}) => <div>{children}</div>) as TooltippedComponentClass<{}>;
const TooltipDiv = ((props) => <div {...props}></div>);

export interface DropRefmapResult {
	isSuccess: boolean;
	message: string;
}

export interface RefMapDropSpaceProps {
	currentlyEditingItpt: string;
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
		let itptName: string | null = this.props.currentlyEditingItpt;
		let inputStyle = itptName ? { width: itptName.length + "ex", maxHeight: "100%" } : null;
		return (
			<TooltipDiv className="refmap-drop-outer" >
				{/**tooltipPosition="top" tooltip={this.props.dropText} */}
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
					<span>now editing: </span>
					{/*!this.state.message ? this.props.dropText : '...dropped!...'*/}
					<input style={inputStyle} value={itptName ? itptName : "None"} disabled={true} />
					{/*this.state.message ? <><br /><br />{this.state.message}</> : null*/}
				</div>
			</TooltipDiv>
		);
	}
}
