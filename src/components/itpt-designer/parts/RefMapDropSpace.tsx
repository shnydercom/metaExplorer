import { Component } from "react";
import Tooltip, { TooltipProps, TooltipComponent, TooltippedComponentClass, tooltipFactory } from "react-toolbox/lib/tooltip";
import { Input, InputProps } from "react-toolbox/lib/input";

//const TooltipDiv = tooltipFactory({ passthrough: false })(({children}) => <div>{children}</div>) as TooltippedComponentClass<{}>;
const TooltipDiv = Tooltip((props) => <div {...props}></div>) as TooltippedComponentClass<{}>;

export interface DropRefmapResult {
	isSuccess: boolean;
	message: string;
}

export interface RefMapDropSpaceProps {
	currentDisplayedItpt: string;
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
		let itptName: string | null = this.props.currentDisplayedItpt;
		return (
			<TooltipDiv className="refmap-drop-outer" tooltipPosition="top" tooltip={this.props.dropText}>
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
					<span>currently editing: </span>
					{/*!this.state.message ? this.props.dropText : '...dropped!...'*/}
					<Input value={itptName ? itptName : "None"} disabled={true} />
					{/*this.state.message ? <><br /><br />{this.state.message}</> : null*/}
				</div>
			</TooltipDiv>
		);
	}
}
