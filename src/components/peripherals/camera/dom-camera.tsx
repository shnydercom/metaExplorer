import React, { Component } from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import { Button } from 'react-toolbox/lib/button';

let imageFormat: string = 'image/jpeg';
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

export interface DOMCameraProps {
	showControls: boolean;
	onImageCaptured?: (imgURL: string) => void;
	onVideoDisplayReady?: (video: HTMLVideoElement) => void;
	onVideoDisplayRemoved?: () => void;
}

export class DOMCamera extends Component<DOMCameraProps, DOMCameraState> {
	videoDispl: HTMLVideoElement;
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	constructor(props: any) {
		super(props);
		this.state = { curStep: DOMCameraStateEnum.isLoading, vidDeviceList: null, curId: null };
	}

	startStream(strDeviceId: string) {
		let test: MediaStreamConstraints = {};
		if (!this.videoDispl || !strDeviceId) return;
		if (this.videoDispl.srcObject) return;
		navigator.mediaDevices.getUserMedia({ video: { deviceId: strDeviceId }, audio: false })
			.then((stream) => {
				//this.setState({ stream });
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
			.catch((err) => {
				console.error(err);
				this.setStateToError();
				return;
			});
	}

	componentWillUnmount() {
		if (this.state.curStep !== DOMCameraStateEnum.isError)
			this.setState({ curStep: DOMCameraStateEnum.isLoading, vidDeviceList: null, curId: null });
		this.videoDispl.pause();
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
		this.videoDispl = null;
	}

	setStateToError() {
		this.setState({ ...this.state, curStep: DOMCameraStateEnum.isError });
		if (this.props.onVideoDisplayRemoved) {
			this.props.onVideoDisplayRemoved();
		}
	}
	componentDidMount() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setStateToError();
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
					this.setStateToError();
					return;
				} else {
					const deviceId = vidInputList[0].deviceId;
					this.setState({ curId: deviceId, curStep: DOMCameraStateEnum.isVideoing, vidDeviceList: vidInputList });
					this.startStream(deviceId);
					return;
				}
			})
			.catch((err) => {
				this.setStateToError();
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

	render() {
		const { showControls } = this.props;
		const { curStep, curId } = this.state;
		return (
			<div className="dom-camera">
				{(() => {
					switch (curStep) {
						case DOMCameraStateEnum.isError:
							return <FontIcon className="vid-big-icons" value='videocam_off' />;
						case DOMCameraStateEnum.isLoading:
							return <FontIcon className="vid-big-icons" value='videocam' />;
						case DOMCameraStateEnum.isVideoing:
							return <>
								<video ref={(video) => {
									this.videoDispl = video;
									this.startStream(curId);
								}} />
								{showControls ?
									<div className="controls-container">
										<Button icon='camera' floating accent onClick={() => {
											if (this.props.onImageCaptured) this.getScreenshotAsBlob();
										}} />
									</div>
									: null}
							</>;
						default:
							return null;
					}
				})()}
			</div >
		);
	}
}
