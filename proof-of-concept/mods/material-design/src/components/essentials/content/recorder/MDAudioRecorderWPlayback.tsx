import * as React from 'react';
import { MDAudioRecorder } from './MDAudioRecorder';

export interface MDAudioRecorderPlaybackProps {
	onAudioSrcReady?: (audioURL: string) => void;
}
export const MDAudioRecorderWPlayback = (props: MDAudioRecorderPlaybackProps) => {
	const [isRecording, setIsRecording] = React.useState<boolean>(false);
	return (<>
		<MDAudioRecorder showControls={false}
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
