import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { DOMCamera } from './dom-camera';
import { VideoRecorder } from './videoRecorder';
import { blobDownloadTriggerFactory } from './cameraUtils';

class DownloadingDOMCameraWControls extends DOMCamera {

	videoRecorder: VideoRecorder = new VideoRecorder();

	onClickDownload: () => void = () => {
		console.log("onDownload clicked, but no video to download available");
	}

	startVideoRecording() {
		this.videoRecorder.startRecording(this.getStream());
		super.startVideoRecording();
	}

	stopVideoRecording() {
		const videoBlob = this.videoRecorder.stopRecording();
		this.onClickDownload = blobDownloadTriggerFactory(videoBlob, "storybookvideo.webm");
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

	renderControls() {
		return <div>
			<button onClick={() => this.getScreenshotAsBlob()}>get Screenshot (Blob)</button>
			<button onClick={() => this.getScreenshotAsDataURL()}>get Screenshot (DataURL)</button>
			<button onClick={() => this.startVideoRecording()}>start videorecording</button>
			<button onClick={() => this.pauseVideoRecording()}>pause/unpause videorecording</button>
			<button onClick={() => this.stopVideoRecording()}>stop videorecording</button>
			<button onClick={() => this.onClickDownload()}>download video</button>
		</div>;
	}
}

const CameraUXManager = () => {
	const [imgSrc, setImgSrc] = React.useState<string>("");
	return (<>
		<DownloadingDOMCameraWControls isRecordingAudio showControls={false} onImageCaptured={(url) => setImgSrc(url)} />
		<img src={imgSrc} />
	</>);
};

const stories = storiesOf('core-peripherals', module);
stories.add('DOM-Camera with download capability', () => {
	return (
		<CameraUXManager />
	);
}
);
