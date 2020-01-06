import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { DOMMicrophone } from './dom-microphone';
import { AudioRecorder } from '../camera/recorderWrapper';
import { blobDownloadTriggerFactory } from '../camera/cameraUtils';

class DownloadingDOMMicrophoneWControls extends DOMMicrophone {
	audioRecorder: AudioRecorder = new AudioRecorder();

	onClickDownload: () => void = () => {
		console.log("onDownload clicked, but no audio to download available");
	}

	startAudioRecording() {
		this.audioRecorder.startRecording(this.getStream());
		super.startAudioRecording();
	}

	stopAudioRecording() {
		const audioBlob = this.audioRecorder.stopRecording();
		this.onClickDownload = blobDownloadTriggerFactory(audioBlob, "storybookaudio.webm");
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

	renderControls() {
		return <div>
			<button onClick={() => this.startAudioRecording()}>start audiorecording</button>
			<button onClick={() => this.pauseAudioRecording()}>pause/unpause audiorecording</button>
			<button onClick={() => this.stopAudioRecording()}>stop audiorecording</button>
			<button onClick={() => this.onClickDownload()}>download audio</button>
		</div>;
	}
}

const RecordingUXManager = () => {
	return (<>
		<DownloadingDOMMicrophoneWControls showControls={false} />
	</>);
};

const stories = storiesOf('core-peripherals', module);
stories.add('DOM-Microphone', () => {
	return (
		<>
			<RecordingUXManager />
		</>
	);
}
);
