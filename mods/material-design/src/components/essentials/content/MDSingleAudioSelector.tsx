import { Button, Fab } from "@material-ui/core";
import {
	ldBlueprint, AbstractSingleAudioSelector, SingleAudioSelectorBpCfg,
	SingleAudioSelectorStateEnum
} from "@metaexplorer/core";
import Dropzone, { DropzoneRef, DropzoneState } from "react-dropzone";
import React, { createRef, Ref } from "react";
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Audiotrack from '@material-ui/icons/Audiotrack';
import { MDRecorderWPlayback } from "./recorder";

import Delete from '@material-ui/icons/Delete';

export const MD_SINGLE_AUDIO_SELECTOR_NAME = "metaexplorer.io/material-design/SingleAudioSelector";
export const MD_SINGLE_AUDIO_SELECTOR_CFG = { ...SingleAudioSelectorBpCfg };

MD_SINGLE_AUDIO_SELECTOR_CFG.nameSelf = MD_SINGLE_AUDIO_SELECTOR_NAME;

const DRAGGING_IMG_LINK: string = "/media/dragndrop.svg";

const i18nTxts = {
	openRecorder: 'open recorder',
	selectFile: 'select audio file'
};

const cssClasses = {
	root: 'single-audio-sel',
	delBtn: 'del-btn'
};

@ldBlueprint(MD_SINGLE_AUDIO_SELECTOR_CFG)
export class MDSingleAudioSelector extends AbstractSingleAudioSelector {
	protected dropzoneRef: Ref<DropzoneRef> = createRef();

	deletePreview() {
		this.destroyPreview();
		this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isSelectInputType });
	}

	render() {
		const { curStep, isMicAvailable, previewURL } = this.state;
		const dzInputKey = "dz-input";
		return (<Dropzone
			// className={curStep === SingleAudioSelectorStateEnum.isPreviewing ? "single-img-sel accept" : "single-img-sel"}
			accept="audio/*"
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
					case SingleAudioSelectorStateEnum.isSelectInputType:
						return <div className={cssClasses.root} {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							{isMicAvailable
								? <Button className="btn-extension" onClick={() => { this.startMic(); }}>
									<RecordVoiceOverIcon />
									{i18nTxts.openRecorder}
								</Button>
								: null}
							<Button className="btn-extension" onClick={() => { dzstate.open(); }}>
								<Audiotrack />
								{i18nTxts.selectFile}
							</Button></div>;
					case SingleAudioSelectorStateEnum.isRecording:
						return <MDRecorderWPlayback onAudioSrcReady={(a) => {
							this.onDropSuccess(null, a);
						}} />;
					case SingleAudioSelectorStateEnum.isDragging:
						return <div className={`${cssClasses.root}`} {...dzstate.getRootProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
						}>
							<input key={dzInputKey} {...dzstate.getInputProps() as any //todo: check if "as any" can be removed without throwing an error. Currently @types wrong!
							} />
							<img className="md-large-image" style={{ flex: 1 }} src={DRAGGING_IMG_LINK} height="100px" />
						</div>;
					case SingleAudioSelectorStateEnum.isPreviewing:
						return <div className={`${cssClasses.root}`}>
							<audio src={previewURL} controls={true}></audio>
							<Fab
								className={cssClasses.delBtn}
								color="secondary"
								onClick={() => this.deletePreview()} >
								<Delete />
							</Fab>
						</div>;
					case SingleAudioSelectorStateEnum.isError:
						return <span>isError</span>;
					default:
						return null;
				}
			})}
		</Dropzone >);
	}
}
