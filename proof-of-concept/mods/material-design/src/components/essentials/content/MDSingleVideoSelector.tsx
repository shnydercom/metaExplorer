import { Button, Fab } from "@material-ui/core";
import {
	ldBlueprint, AbstractSingleVideoSelector, SingleVideoSelectorBpCfg,
	SingleVideoSelectorStateEnum
} from "@metaexplorer/core";
import Dropzone, { DropzoneRef, DropzoneState } from "react-dropzone";
import React, { createRef, Ref } from "react";
import RecordVideoIcon from '@material-ui/icons/Videocam';
import Videotrack from '@material-ui/icons/Movie';
import { MDVideoRecorderWPlayback } from "./recorder";

import Delete from '@material-ui/icons/Delete';

export const MD_SINGLE_VIDEO_SELECTOR_NAME = "metaexplorer.io/material-design/SingleVideoSelector";
export const MD_SINGLE_VIDEO_SELECTOR_CFG = { ...SingleVideoSelectorBpCfg };

MD_SINGLE_VIDEO_SELECTOR_CFG.nameSelf = MD_SINGLE_VIDEO_SELECTOR_NAME;

const DRAGGING_IMG_LINK: string = "/media/dragndrop.svg";

const i18nTxts = {
	openRecorder: 'open recorder',
	selectFile: 'select video file'
};

const cssClasses = {
	root: 'single-video-sel',
	delBtn: 'del-btn'
};

@ldBlueprint(MD_SINGLE_VIDEO_SELECTOR_CFG)
export class MDSingleVideoSelector extends AbstractSingleVideoSelector {
	protected dropzoneRef: Ref<DropzoneRef> = createRef();

	deletePreview() {
		this.destroyPreview();
		this.setState({ ...this.state, curStep: SingleVideoSelectorStateEnum.isSelectInputType });
	}

	render() {
		const { curStep, isCameraAvailable, previewURL } = this.state;
		const dzInputKey = "dz-input";
		return (<Dropzone
			// className={curStep === SingleVideoSelectorStateEnum.isPreviewing ? "single-img-sel accept" : "single-img-sel"}
			accept="video/*"
			multiple={false}
			noClick={true}
			//disableClick={true}
			ref={this.dropzoneRef}
			onDropAccepted={(acceptedOrRejected) => {
				let files = acceptedOrRejected.map((file) => ({
					...file,
					preview: URL.createObjectURL(file)
				}));
				this.onDropSuccess(files[0], files[0].preview);
			}}
			onDropRejected={() => {
				this.onDropFailure();
			}}
			//onDragStart={() => this.startDrag()}
			onDragEnter={() => this.startDrag()}
			onDragOver={() => this.startDrag()}
			onDragLeave={() => this.onDropFailure()}
			onFileDialogCancel={() => this.onDropFailure()}
			onDrop={(aF) => console.log(aF)}
		>
			{((dzstate: DropzoneState) => {
				switch (curStep) {
					case SingleVideoSelectorStateEnum.isSelectInputType:
						return <div className={cssClasses.root} {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							{isCameraAvailable
								? <Button className="btn-extension" onClick={() => { this.startCamera(); }}>
									<RecordVideoIcon />
									{i18nTxts.openRecorder}
								</Button>
								: null}
							<Button className="btn-extension" onClick={() => { dzstate.open(); }}>
								<Videotrack />
								{i18nTxts.selectFile}
							</Button></div>;
					case SingleVideoSelectorStateEnum.isRecording:
						return <MDVideoRecorderWPlayback onVideoSrcReady={(a) => {
							this.onDropSuccess(null, a);
						}} />;
					case SingleVideoSelectorStateEnum.isDragging:
						return <div className={`${cssClasses.root}`} {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							<img className="md-large-image" style={{ flex: 1 }} src={DRAGGING_IMG_LINK} height="100px" />
						</div>;
					case SingleVideoSelectorStateEnum.isPreviewing:
						return <div className={`${cssClasses.root}`}>
							<video src={previewURL} controls={true}></video>
							<Fab
								className={cssClasses.delBtn}
								color="secondary"
								onClick={() => this.deletePreview()} >
								<Delete />
							</Fab>
						</div>;
					case SingleVideoSelectorStateEnum.isError:
						return <span>isError</span>;
					default:
						return null;
				}
			})}
		</Dropzone >);
	}
}
