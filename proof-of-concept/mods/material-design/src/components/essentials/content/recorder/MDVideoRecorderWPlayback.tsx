import * as React from 'react';
import { MDVideoRecorder } from './MDVideoRecorder';

export interface MDVideoRecorderPlaybackProps {
	onVideoSrcReady?: (audioURL: string) => void;
}
export const MDVideoRecorderWPlayback = (props: MDVideoRecorderPlaybackProps) => {
	const [isRecording, setIsRecording] = React.useState<boolean>(false);
	return (<>
		<MDVideoRecorder showControls={false}
			isRecording={isRecording}
			onVideoRecordingStarted={
				() => setIsRecording(true)
			}
			onVideoRecordingStopped={
				() => setIsRecording(false)
			}
			onVideoSrcReady={(url) => {
				props.onVideoSrcReady(url);
			}} />
	</>);
};
