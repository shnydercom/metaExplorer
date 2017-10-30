import * as React from "react";

export interface DesignerTrayProps {}

export interface DesignerTrayState {}

/**
 * @author Dylan Vorster
 */
export class DesignerTray extends React.Component<DesignerTrayProps, DesignerTrayState> {
	public static defaultProps: DesignerTrayProps = {};

	constructor(props: DesignerTrayProps) {
		super(props);
		this.state = {};
	}

	render() {
		return <div className="designer-tray">{this.props.children}</div>;
	}
}
