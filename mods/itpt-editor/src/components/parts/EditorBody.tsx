import React, { Component } from "react";
import { DiagramWidget } from "storm-react-diagrams";
import { EditorLogic } from "./editor-logic";

export interface EditorBodyProps {
	logic: EditorLogic;
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
export class EditorBody extends Component<EditorBodyProps, EditorBodyState> {

	static getDerivedStateFromProps(nextProps: EditorBodyProps, prevState: EditorBodyState): EditorBodyState | null {
		if (nextProps.currentlyEditingItpt !== prevState.currentlyEditingItpt) {
			let nextCurEditItpt = nextProps.currentlyEditingItpt;
			return { currentlyEditingItpt: nextCurEditItpt, isReloadToEditor: true };
		}
		return null;
	}

	// private privOnRMDrop = this.onRefMapDrop.bind(this);
	constructor(props: EditorBodyProps) {
		super(props);
		this.state = { currentlyEditingItpt: null, isReloadToEditor: false };
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
		/*onDrop={(event) => {
						var data = JSON.parse(event.dataTransfer.getData("ld-node"));
						
						this.forceUpdate();
					}}*/
		return (
			<div className="diagram-body">
				<div
					className="diagram-layer"
					onDragOver={(event) => {
						event.preventDefault();
					}}
				>
					<DiagramWidget inverseZoom diagramEngine={this.props.logic.getDiagramEngine()} maxNumberPointsPerLink={0} />
					{hideRefMapDropSpace
						? null
						: <div className="editor-top-bar">
							{/*<RefMapDropSpace
								currentlyEditingItpt={this.state.currentlyEditingItpt}
								dropText="...drop a Compound Block here to edit and load it to the preview..."
								refMapDrop={this.privOnRMDrop}
							/>*/}
						</div>
					}
				</div>
			</div>
		);
	}
}
