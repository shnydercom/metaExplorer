import * as React from 'react';
import { DOMMicrophone, AudioRecorder, DOMMicrophoneStateEnum } from "@metaexplorer/core";
import { Fab } from '@material-ui/core';

import MicOff from '@material-ui/icons/MicOff';
import Mic from '@material-ui/icons/Mic';
import Stop from '@material-ui/icons/Stop';
import { MDRecorderProps } from './interfaces';

const cssClasses = {
	controlsContainer: "controls-container"
};

export class MDAudioRecorder extends DOMMicrophone<MDRecorderProps> {

	audioRecorder: AudioRecorder = new AudioRecorder();

	startAudioRecording() {
		this.audioRecorder.startRecording(this.getStream());
		super.startAudioRecording();
	}

	stopAudioRecording() {
		const audioBlob = this.audioRecorder.stopRecording();
		this.getStream().getTracks().forEach((track) => {
			track.stop();
		});
		if (this.props.onAudioSrcReady) this.props.onAudioSrcReady(window.URL.createObjectURL(audioBlob));
		super.stopAudioRecording();
	}

	pauseAudioRecording() {
		if (this.audioRecorder.getRecordingState() === "recording") {
			this.audioRecorder.stopRecording();
			super.pauseAudioRecording();
		} else {
			this.audioRecorder.startRecording(this.getStream());
		}
	}

	onFabClick(): void {
		const { curStep } = this.state;
		if (curStep !== DOMMicrophoneStateEnum.isListening) return;
		switch (this.audioRecorder.getRecordingState()) {
			case 'inactive':
				this.startAudioRecording();
				return;
			case 'recording':
				this.stopAudioRecording();
				return;
			default:
				break;
		}
	}

	getFabIcon() {
		const { curStep } = this.state;
		const { isRecording } = this.props;
		if (curStep !== DOMMicrophoneStateEnum.isListening) return <MicOff />;
		if (isRecording) {
			return <Stop />;
		} else {
			return <Mic />;
		}
	}

	renderControls() {
		const { curStep } = this.state;
		return <div className={cssClasses.controlsContainer}>
			<Fab
				color="secondary"
				disabled={curStep !== DOMMicrophoneStateEnum.isListening}
				onClick={() => this.onFabClick()} >
				{this.getFabIcon()}
			</Fab>
		</div>;
	}
}
