import React, { Component } from 'react';

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
	audioInputDeviceList: MediaDeviceInfo[];
	curId: string;
}

export interface DOMMicrophoneTriggers {
	onAudioSrcReady?: (audioURL: string) => void;
	onAudioRecordingStarted?: () => void;
	onAudioRecordingStopped?: () => void;
	onAudioRecordingPaused?: () => void;
}

export interface DOMMicrophoneCallbacks {
	onAudioVisualizationReady?: (video: HTMLVideoElement) => void;
	onAudioVisualizationRemoved?: () => void;
	onError?: (errorType: DOMMicrophoneErrorTypes) => void;
}

export interface DOMMicrophoneProps extends DOMMicrophoneTriggers, DOMMicrophoneCallbacks {
	showControls: boolean;
}

export class DOMMicrophone<TProps = DOMMicrophoneProps> extends Component<TProps & DOMMicrophoneProps, DOMMicrophoneState> {
	ctx: CanvasRenderingContext2D;
	audioVisualization: HTMLCanvasElement;

	private stream: MediaStream;

	constructor(props: any) {
		super(props);
		this.state = { curStep: DOMMicrophoneStateEnum.isLoading, audioInputDeviceList: null, curId: null };
	}

	public getStream() {
		return this.stream;
	}

	startStream(strDeviceId: string) {
		if (!this.audioVisualization || !strDeviceId) return;
		navigator.mediaDevices.getUserMedia({ audio: { deviceId: strDeviceId } })
			.then((stream) => {
				if (!this.audioVisualization) {
					this.stream.getTracks().forEach((track) => {
						track.stop();
					});
					return;
				}
				this.stream = stream;
			})
			.catch(() => {
				this.setStateToError(DOMMicrophoneErrorTypes.streamError);
				return;
			});
	}

	componentWillUnmount() {
		if (this.state.curStep !== DOMMicrophoneStateEnum.isError)
			this.setState({ curStep: DOMMicrophoneStateEnum.isLoading, audioInputDeviceList: null, curId: null });
		if (this.stream && this.stream.active) {
			this.stream.getTracks().forEach((track) => {
				track.stop();
			});
		}
		if (this.props.onAudioVisualizationRemoved) {
			this.props.onAudioVisualizationRemoved();
		}
		this.audioVisualization = null;
	}

	setStateToError(errorType: DOMMicrophoneErrorTypes) {
		this.setState({ ...this.state, curStep: DOMMicrophoneStateEnum.isError });
		if (this.props.onAudioVisualizationRemoved) {
			this.props.onAudioVisualizationRemoved();
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
				let audioInputList: MediaDeviceInfo[] = [];
				devices.forEach((device) => {
					if (device.kind === "audioinput")
						audioInputList.push(device);
				});
				if (audioInputList.length === 0) {
					this.setStateToError(DOMMicrophoneErrorTypes.noVideoInputs);
					return;
				} else {
					const deviceId = audioInputList[0].deviceId;
					this.setState({
						curId: deviceId,
						curStep: DOMMicrophoneStateEnum.isListening,
						audioInputDeviceList: audioInputList
					});
					this.startStream(deviceId);
					return;
				}
			})
			.catch(() => {
				this.setStateToError(DOMMicrophoneErrorTypes.enumerateDevicesFail);
				return;
			});

	}

	startAudioRecording() {
		console.log("started audio recording");
		if (this.props.onAudioRecordingStarted) this.props.onAudioRecordingStarted();
	}

	stopAudioRecording() {
		console.log("stopped audio recording");
		if (this.props.onAudioRecordingStopped) this.props.onAudioRecordingStopped();
	}

	pauseAudioRecording() {
		console.log("paused audio recording");
		if (this.props.onAudioRecordingPaused) this.props.onAudioRecordingPaused();
	}

	renderError() {
		return <span>error opening microphone</span>;
	}

	renderLoading() {
		return <span>loading</span>;
	}

	renderVisualization() {
		return <canvas ref={(canvas) => {
			this.audioVisualization = canvas;
			//this.startStream(curId);
		}} />;
	}

	renderControls() {
		return <div className="controls-container">
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
