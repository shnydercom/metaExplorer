import React, { Component } from "react";
import { NodeEditorLogic } from "./NodeEditorLogic";
import { ErrorhandlingCanvasWidget } from "./ErrorhandlingCanvasWidget";

export interface EditorBodyProps {
	logic: NodeEditorLogic;
	currentlyEditingItpt: string | null;
	changeCurrentlyEditingItpt: (newItpt: string | null) => void;
	loadToEditorByName: (name: string, isDoAutodistribute?: boolean) => void;
	hideRefMapDropSpace: boolean;
}

export interface EditorBodyState {
	currentlyEditingItpt: string | null;
	isReloadToEditor: boolean;
}

/**
 * @author Jonathan Schneider
 */
export class NodeEditorBody extends Component<EditorBodyProps, EditorBodyState> {

	static getDerivedStateFromProps(nextProps: EditorBodyProps, prevState: EditorBodyState): EditorBodyState | null {
		if (nextProps.currentlyEditingItpt !== prevState.currentlyEditingItpt) {
			let nextCurEditItpt = nextProps.currentlyEditingItpt;
			return { currentlyEditingItpt: nextCurEditItpt, isReloadToEditor: true };
		}
		return null;
	}

	constructor(props: EditorBodyProps) {
		super(props);
		this.state = { currentlyEditingItpt: null, isReloadToEditor: false };
	}

	componentDidMount() {
		if (this.props.logic) {
			this.props.logic.autoDistribute();
		}
	}

	componentDidUpdate(nextProps: EditorBodyProps) {
		const { currentlyEditingItpt, isReloadToEditor } = this.state;
		if (!isReloadToEditor && currentlyEditingItpt) {
			if (currentlyEditingItpt) {
				nextProps.logic.clear();
				nextProps.loadToEditorByName(currentlyEditingItpt, true);
				this.setState({ ...this.state, isReloadToEditor: false });
			}
		}
	}

	render() {
		const { hideRefMapDropSpace } = this.props;
		return (
			<div className="diagram-body">
				<div
					className="diagram-layer"
					onDragOver={(event) => {
						event.preventDefault();
					}}
				>
					<ErrorhandlingCanvasWidget className="srd-diagram" engine={this.props.logic.getDiagramEngine()} />
					{hideRefMapDropSpace
						? null
						: <div className="editor-top-bar">
						</div>
					}
				</div>
			</div>
		);
	}
}
