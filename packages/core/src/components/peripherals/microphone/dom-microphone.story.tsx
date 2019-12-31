import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { DOMMicrophone } from './dom-microphone';

const stories = storiesOf('core-peripherals', module);
stories.add('DOM-Microphone', () => {
	return (
		<>
			<DOMMicrophone showControls={false} />
		</>
	);
}
);
