import { Component } from "react";

export interface DesignerTrayProps {}

export interface DesignerTrayState {}

/**
 * @author Dylan Vorster
 */
export class DesignerTray extends Component<DesignerTrayProps, DesignerTrayState> {
	public static defaultProps: DesignerTrayProps = {};

	constructor(props: DesignerTrayProps) {
		super(props);
		this.state = {};
	}

	render() {
		return <div className="designer-tray mdscrollbar">{this.props.children}</div>;
	}
}
