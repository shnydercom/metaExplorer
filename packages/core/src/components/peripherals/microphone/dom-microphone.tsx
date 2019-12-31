import React, { Component } from 'react';

let imageFormat: string = 'image/jpeg';

export enum DOMMicrophoneErrorTypes {
	streamError = 2,
	mediaDevicesAccessFail = 3,
	noVideoInputs = 4,
	enumerateDevicesFail = 5
}

export enum DOMMicrophoneStateEnum {
	isLoading = 2,
	isError = 3,
	isListening = 4,
}

export interface DOMMicrophoneState {
	curStep: DOMMicrophoneStateEnum;
	vidDeviceList: MediaDeviceInfo[];
	curId: string;
}

export interface DOMMicrophoneTriggers {
	triggerImageCapture?: () => void;
	triggerVideoRecordingStart?: () => void;
	triggerVideoRecordingStop?: () => void;
	triggerVideoRecordingPause?: () => void;
}

export interface DOMMicrophoneCallbacks {
	onImageCaptured?: (imgURL: string) => void;
	onVideoDisplayReady?: (video: HTMLVideoElement) => void;
	onVideoDisplayRemoved?: () => void;
	onError?: (errorType: DOMMicrophoneErrorTypes) => void;
}

export interface DOMMicrophoneProps extends DOMMicrophoneTriggers, DOMMicrophoneCallbacks {
	showControls: boolean;
}

export class DOMMicrophone extends Component<DOMMicrophoneProps, DOMMicrophoneState> {
	videoDispl: HTMLVideoElement;
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	constructor(props: any) {
		super(props);
		this.state = { curStep: DOMMicrophoneStateEnum.isLoading, vidDeviceList: null, curId: null };
	}

	startStream(strDeviceId: string) {
		if (!this.videoDispl || !strDeviceId) return;
		if (this.videoDispl.srcObject) return;
		navigator.mediaDevices.getUserMedia({ video: { deviceId: strDeviceId }, audio: false })
			.then((stream) => {
				if (!this.videoDispl.paused) return;
				this.videoDispl.setAttribute("autoplay", 'true');
				this.videoDispl.setAttribute('muted', 'true');
				this.videoDispl.setAttribute('playsinline', 'true');
				this.videoDispl.srcObject = stream;
				this.videoDispl.play();
				if (this.props.onVideoDisplayReady) {
					this.props.onVideoDisplayReady(this.videoDispl);
				}
			})
			.catch(() => {
				this.setStateToError(DOMMicrophoneErrorTypes.streamError);
				return;
			});
	}

	componentWillUnmount() {
		if (this.state.curStep !== DOMMicrophoneStateEnum.isError)
			this.setState({ curStep: DOMMicrophoneStateEnum.isLoading, vidDeviceList: null, curId: null });
		if (this.videoDispl) this.videoDispl.pause();
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
		this.videoDispl = null;
	}

	setStateToError(errorType: DOMMicrophoneErrorTypes) {
		this.setState({ ...this.state, curStep: DOMMicrophoneStateEnum.isError });
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
		if (this.props.onError) {
			this.props.onError(errorType);
		}
	}
	componentDidMount() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setStateToError(DOMMicrophoneErrorTypes.mediaDevicesAccessFail);
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
					this.setStateToError(DOMMicrophoneErrorTypes.noVideoInputs);
					return;
				} else {
					const deviceId = vidInputList[0].deviceId;
					this.setState({ curId: deviceId, curStep: DOMMicrophoneStateEnum.isListening, vidDeviceList: vidInputList });
					this.startStream(deviceId);
					return;
				}
			})
			.catch(() => {
				this.setStateToError(DOMMicrophoneErrorTypes.enumerateDevicesFail);
				return;
			});

	}

	getScreenshotAsDataURL() {
		const canvas = this.getCanvas();
		return canvas && canvas.toDataURL(imageFormat);
	}

	getScreenshotAsBlob() {
		const canvas = this.getCanvas();
		return canvas && canvas.toBlob((a) => {
			const b = window.URL.createObjectURL(a);
			this.props.onImageCaptured(b);
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

	renderError() {
		return <span>error opening microphone</span>;
	}

	renderLoading() {
		return <span>loading</span>;
	}

	renderVisualization() {
		const { curId } = this.state;
		return <video ref={(video) => {
			this.videoDispl = video;
			this.startStream(curId);
		}} />;
	}

	renderControls() {
		return <div className="controls-container">
			<button onClick={() => {
				if (this.props.onImageCaptured) this.getScreenshotAsBlob();
			}} />
		</div>;
	}

	render() {
		const { curStep } = this.state;
		return (
			<div className="dom-microphone">
				{(() => {
					switch (curStep) {
						case DOMMicrophoneStateEnum.isError:
							return this.renderError();
						case DOMMicrophoneStateEnum.isLoading:
							return this.renderLoading();
						case DOMMicrophoneStateEnum.isListening:
							return <>
								{this.renderVisualization()}
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
