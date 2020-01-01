/// <reference types="@types/dom-mediacapture-record" />

/**
 * adopted from here:
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js
 */
export class VideoRecorder {

	mediaRecorder;
	recordedBlobs: BlobPart[];
	sourceBuffer;
	mediaSource: MediaSource;
	constructor() {
		this.mediaSource = new MediaSource();
		this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
	}
	startRecording(stream: MediaStream) {
		this.recordedBlobs = [];
		let options = { mimeType: 'video/webm;codecs=vp9' };
		let errorMsg: string = "";
		if (!MediaRecorder.isTypeSupported(options.mimeType)) {
			console.error(`${options.mimeType} is not Supported`);
			errorMsg = `${options.mimeType} is not Supported`;
			options = { mimeType: 'video/webm;codecs=vp8' };
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				console.error(`${options.mimeType} is not Supported`);
				errorMsg = `${options.mimeType} is not Supported`;
				options = { mimeType: 'video/webm' };
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					console.error(`${options.mimeType} is not Supported`);
					errorMsg = `${options.mimeType} is not Supported`;
					options = { mimeType: '' };
				}
			}
		}

		if (errorMsg) throw errorMsg;

		try {
			this.mediaRecorder = new MediaRecorder(stream, options);
		} catch (e) {
			console.error('Exception while creating MediaRecorder:', e);
			errorMsg = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
			throw errorMsg;
		}

		console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

		this.mediaRecorder.onstop = (event) => {
			console.log('Recorder stopped: ', event);
			console.log('Recorded Blobs: ', this.recordedBlobs);
		};
		this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
		this.mediaRecorder.start(10); // collect 10ms of data
		console.log('MediaRecorder started', this.mediaRecorder);
	}

	getRecordingState(): RecordingState {
		return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
	}

	stopRecording(): Blob {
		this.mediaRecorder.stop();
		const superBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
		return superBuffer;
	}

	private handleDataAvailable(event) {
		console.log('handleDataAvailable', event);
		if (event.data && event.data.size > 0) {
			this.recordedBlobs.push(event.data);
		}
	}

	private handleSourceOpen(event) {
		console.log('MediaSource opened');
		this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
		console.log('Source buffer: ', this.sourceBuffer);
	}
}
