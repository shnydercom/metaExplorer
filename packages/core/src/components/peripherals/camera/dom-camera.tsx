import React, { Component } from 'react';

let imageFormat: string = 'image/jpeg';

export enum DOMCameraErrorTypes {
	streamError = 2,
	mediaDevicesAccessFail = 3,
	noVideoInputs = 4,
	enumerateDevicesFail = 5
}

export enum DOMCameraStateEnum {
	isLoading = 2,
	isError = 3,
	isVideoing = 4,
}

export interface DOMCameraState {
	curStep: DOMCameraStateEnum;
	vidDeviceList: MediaDeviceInfo[];
	curId: string;
}

export interface DOMCameraUserInteraction {
	onImageSrcReady?: (imgURL: string) => void;
	onVideoSrcReady?: (videoURL: string) => void;
	onVideoRecordingStarted?: () => void;
	onVideoRecordingStopped?: () => void;
	onVideoRecordingPaused?: () => void;
}

export interface DOMCameraCallbacks {
	onVideoDisplayReady?: (video: HTMLVideoElement) => void;
	onVideoDisplayRemoved?: () => void;
	onError?: (errorType: DOMCameraErrorTypes) => void;
}

/**
 * inspired by:
 * https://webrtc.github.io/samples/
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js
 */
export interface DOMCameraProps extends DOMCameraUserInteraction, DOMCameraCallbacks {
	showControls: boolean;
	isRecordingAudio?: boolean;
}

export class DOMCamera extends Component<DOMCameraProps, DOMCameraState> {
	videoDispl: HTMLVideoElement;
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;

	private stream: MediaStream;

	constructor(props: any) {
		super(props);
		this.state = { curStep: DOMCameraStateEnum.isLoading, vidDeviceList: null, curId: null };
	}

	public getStream(){
		return this.stream;
	}

	startStream(strDeviceId: string) {
		if (!this.videoDispl || !strDeviceId) return;
		if (this.videoDispl.srcObject) return;
		navigator.mediaDevices.getUserMedia({ video: { deviceId: strDeviceId }, audio: !!this.props.isRecordingAudio })
			.then((stream) => {
				if (!this.videoDispl.paused) return;
				this.stream = stream;
				this.videoDispl.setAttribute("autoplay", 'true');
				this.videoDispl.setAttribute('muted', 'true');
				this.videoDispl.muted = true;
				this.videoDispl.setAttribute('playsinline', 'true');
				this.videoDispl.srcObject = stream;
				this.videoDispl.play();
				if (this.props.onVideoDisplayReady) {
					this.props.onVideoDisplayReady(this.videoDispl);
				}
			})
			.catch(() => {
				this.setStateToError(DOMCameraErrorTypes.streamError);
				return;
			});
	}

	componentWillUnmount() {
		if (this.state.curStep !== DOMCameraStateEnum.isError)
			this.setState({ curStep: DOMCameraStateEnum.isLoading, vidDeviceList: null, curId: null });
		if (this.videoDispl) this.videoDispl.pause();
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
		this.videoDispl = null;
	}

	setStateToError(errorType: DOMCameraErrorTypes) {
		this.setState({ ...this.state, curStep: DOMCameraStateEnum.isError });
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
		if (this.props.onError) {
			this.props.onError(errorType);
		}
	}
	componentDidMount() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setStateToError(DOMCameraErrorTypes.mediaDevicesAccessFail);
			return;
		}
		navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				let vidInputList: MediaDeviceInfo[] = [];
				devices.forEach((device) => {
					if (device.kind === "videoinput")
						vidInputList.push(device);
				});
				if (vidInputList.length === 0) {
					this.setStateToError(DOMCameraErrorTypes.noVideoInputs);
					return;
				} else {
					const deviceId = vidInputList[0].deviceId;
					this.setState({ curId: deviceId, curStep: DOMCameraStateEnum.isVideoing, vidDeviceList: vidInputList });
					this.startStream(deviceId);
					return;
				}
			})
			.catch(() => {
				this.setStateToError(DOMCameraErrorTypes.enumerateDevicesFail);
				return;
			});

	}

	getScreenshotAsDataURL() {
		const canvas = this.getCanvas();
		if (canvas) {
			const b = canvas.toDataURL(imageFormat);
			this.props.onImageSrcReady(b);
		}
	}

	getScreenshotAsBlob() {
		const canvas = this.getCanvas();
		return canvas && canvas.toBlob((a) => {
			const b = window.URL.createObjectURL(a);
			this.props.onImageSrcReady(b);
		});
	}

	getCanvas() {
		if (!this.videoDispl.videoHeight) return null;

		if (!this.ctx) {
			const canvasElem = document.createElement('canvas');
			const aspectRatio = this.videoDispl.videoWidth / this.videoDispl.videoHeight;

			canvasElem.width = this.videoDispl.clientWidth;
			canvasElem.height = this.videoDispl.clientWidth / aspectRatio;

			this.canvas = canvasElem;
			this.ctx = canvasElem.getContext('2d');
		}

		const { ctx, canvas } = this;
		ctx.drawImage(this.videoDispl, 0, 0, canvas.width, canvas.height);

		return canvas;
	}

	startVideoRecording() {
		console.log("started video recording");
		if (this.props.onVideoRecordingStarted) this.props.onVideoRecordingStarted();
	}

	stopVideoRecording() {
		console.log("stopped video recording");
		if (this.props.onVideoRecordingStopped) this.props.onVideoRecordingStopped();
	}

	pauseVideoRecording() {
		console.log("paused video recording");
		if (this.props.onVideoRecordingPaused) this.props.onVideoRecordingPaused();
	}

	renderError() {
		return <span>error opening camera</span>;
	}

	renderLoading() {
		return <span>loading</span>;
	}

	renderVideo() {
		const { curId } = this.state;
		return <video ref={(video) => {
			this.videoDispl = video;
			this.startStream(curId);
		}} />;
	}

	renderControls() {
		return <div className="controls-container">
			{/* icon='camera' floating accent  */}
			<button onClick={() => {
				if (this.props.onImageSrcReady) this.getScreenshotAsBlob();
			}} />
		</div>;
	}

	render() {
		const { curStep } = this.state;
		return (
			<div className="dom-camera">
				{(() => {
					switch (curStep) {
						case DOMCameraStateEnum.isError:
							return this.renderError();
						/*<FontIcon className="vid-big-icons" value='videocam_off' />;*/
						case DOMCameraStateEnum.isLoading:
							return this.renderLoading();
						/*<FontIcon className="vid-big-icons" value='videocam' />;*/
						case DOMCameraStateEnum.isVideoing:
							return <>
								{this.renderVideo()}
								{this.renderControls()}
							</>;
						default:
							return null;
					}
				})()}
			</div >
		);
	}
}
