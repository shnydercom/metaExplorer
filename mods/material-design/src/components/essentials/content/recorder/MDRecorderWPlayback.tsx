import * as React from 'react';
import { MDRecorder } from './MDRecorder';

export interface MDRecorderPlaybackProps {
	onAudioSrcReady?: (audioURL: string) => void;
}
export const MDRecorderWPlayback = (props: MDRecorderPlaybackProps) => {
	const [isRecording, setIsRecording] = React.useState<boolean>(false);
	return (<>
		<MDRecorder showControls={false}
			isRecording={isRecording}
			onAudioRecordingStarted={
				() => setIsRecording(true)
			}
			onAudioRecordingStopped={
				() => setIsRecording(false)
			}
			onAudioSrcReady={(url) => {
				props.onAudioSrcReady(url);
			}} />
	</>);
};
