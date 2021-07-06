import { CanvasWidget } from "@projectstorm/react-canvas-core"
import React from "react";

export class ErrorhandlingCanvasWidget extends CanvasWidget {

	componentDidMount() {
		super.componentDidMount();
		const engine = this.props.engine;
		if(engine.getCanvas()){
			this.forceUpdate();
		}
	}

	render() {
		const engine = this.props.engine;
		if (!engine.getCanvas()) {
			return (
				<div
					className={this.props.className}
					ref={this.ref}
				/>
			);
		}
		return super.render();
	}
}
