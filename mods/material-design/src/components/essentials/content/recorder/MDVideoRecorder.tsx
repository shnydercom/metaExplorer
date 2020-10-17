import * as React from 'react';
import {  DOMCamera, VideoRecorder, DOMCameraStateEnum } from '@metaexplorer/core';
import { Fab } from '@material-ui/core';
import Stop from '@material-ui/icons/Stop';
import CameraOff from '@material-ui/icons/VideocamOff';
import Camera from '@material-ui/icons/Videocam';
import { MDRecorderProps } from './interfaces';

const cssClasses = {
	controlsContainer: "controls-container"
};

export class MDVideoRecorder extends DOMCamera<MDRecorderProps> {

	videoRecorder: VideoRecorder = new VideoRecorder();

	startVideoRecording() {
		this.videoRecorder.startRecording(this.getStream());
		super.startVideoRecording();
	}

	stopVideoRecording() {
		const videoBlob = this.videoRecorder.stopRecording();
		this.getStream().getTracks().forEach((track) => {
			track.stop();
		});
		if (this.props.onVideoSrcReady) this.props.onVideoSrcReady(window.URL.createObjectURL(videoBlob));
		super.stopVideoRecording();
	}

	pauseVideoRecording() {
		if (this.videoRecorder.getRecordingState() === "recording") {
			this.videoRecorder.stopRecording();
			super.pauseVideoRecording();
		} else {
			this.videoRecorder.startRecording(this.getStream());
		}
	}

	onFabClick(): void {
		const { curStep } = this.state;
		if (curStep !== DOMCameraStateEnum.isVideoing) return;
		switch (this.videoRecorder.getRecordingState()) {
			case 'inactive':
				this.startVideoRecording();
				return;
			case 'recording':
				this.stopVideoRecording();
				return;
			default:
				break;
		}
	}

	getFabIcon() {
		const { curStep } = this.state;
		const { isRecording } = this.props;
		if (curStep !== DOMCameraStateEnum.isVideoing) return <CameraOff />;
		if (isRecording) {
			return <Stop />;
		} else {
			return <Camera />;
		}
	}

	renderControls() {
		const { curStep } = this.state;
		return <div className={cssClasses.controlsContainer}>
			<Fab
				color="secondary"
				disabled={curStep !== DOMCameraStateEnum.isVideoing}
				onClick={() => this.onFabClick()} >
				{this.getFabIcon()}
			</Fab>
		</div>;
	}
}
