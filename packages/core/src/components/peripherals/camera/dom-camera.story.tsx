import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { DOMCamera } from './dom-camera';

class DOMCameraWControls extends DOMCamera {

	renderControls() {
		return <div>
			<button onClick={() => this.getScreenshotAsBlob()}>get Screenshot (Blob)</button>
			<button onClick={() => this.getScreenshotAsDataURL()}>get Screenshot (DataURL)</button>
			<button onClick={() => this.startVideoRecording()}>start videorecording</button>
			<button onClick={() => this.pauseVideoRecording()}>pause videorecording</button>
			<button onClick={() => this.stopVideoRecording()}>stop videorecording</button>
		</div>;
	}
}

const CameraUXManager = () => {
	const [imgSrc, setImgSrc] = React.useState<string>("");
	return (<>
		<DOMCameraWControls isRecordingAudio showControls={false} onImageCaptured={(url) => setImgSrc(url)}/>
		<img src={imgSrc}/>
	</>);
};

const stories = storiesOf('core-peripherals', module);
stories.add('DOM-Camera', () => {
	return (
		<CameraUXManager />
	);
}
);
