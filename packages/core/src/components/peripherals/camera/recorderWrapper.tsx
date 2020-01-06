/// <reference types="@types/dom-mediacapture-record" />

export const MIMETYPE_WEBM_VP8 = 'video/webm; codecs="vp8"';
export const MIMETYPE_WEBM_VP9 = 'video/webm;codecs=vp8';
export const MIMETYPE_WEBM = 'video/webm';

export const MIMETYPE_RECORDER_DEFAULTS = [
	MIMETYPE_WEBM_VP8,
	MIMETYPE_WEBM_VP9,
	MIMETYPE_WEBM,
	''
];

/**
 * adopted from here:
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js
 * this class shall not contain codec-specifics, it's just intended for the process
 */
export class RecorderWrapper {

	//source
	mediaSource: MediaSource;
	sourceBuffer;
	//target
	mediaRecorder;
	recordedBlobs: BlobPart[];
	//source - private
	private mediaSourceMimeType: string;
	//target -private
	private supportedMediaRecorderMimeTypes: string[];

	constructor(
		mediaSourceMimeType: string,
		supportedMediaRecorderMimeTypes?: string[]
	) {
		this.mediaSourceMimeType = mediaSourceMimeType;
		this.supportedMediaRecorderMimeTypes = supportedMediaRecorderMimeTypes;
		this.mediaSource = new MediaSource();
		this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
	}

	startRecording(stream: MediaStream) {
		this.recordedBlobs = [];
		let options: MediaRecorderOptions | undefined;
		let errorMsg: string;
		if (this.supportedMediaRecorderMimeTypes) {
			for (let idx = 0; idx < this.supportedMediaRecorderMimeTypes.length; idx++) {
				const smmt = this.supportedMediaRecorderMimeTypes[idx];
				options = { mimeType: smmt };
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					errorMsg = `${options.mimeType} is not Supported`;
				} else {
					break;
				}
			}
		}
		if (errorMsg) throw errorMsg;

		try {
			//options is intentionally possibly undefined
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
		const sourceBufferMimeType = this.mediaSourceMimeType ? this.mediaSourceMimeType : '';
		this.sourceBuffer = this.mediaSource.addSourceBuffer(sourceBufferMimeType);
		console.log('Source buffer: ', this.sourceBuffer);
	}
}

export class VideoRecorder extends RecorderWrapper {
	constructor(
		mediaSourceMimeType: string = MIMETYPE_WEBM_VP8,
		supportedMediaRecorderMimeTypes: string[] = MIMETYPE_RECORDER_DEFAULTS
	) {
		super(mediaSourceMimeType, supportedMediaRecorderMimeTypes);
	}
}

export class AudioRecorder extends RecorderWrapper {
	constructor(
		mediaSourceMimeType: string = '',
		supportedMediaRecorderMimeTypes?: string[]
	) {
		super(mediaSourceMimeType, supportedMediaRecorderMimeTypes);
	}
}
