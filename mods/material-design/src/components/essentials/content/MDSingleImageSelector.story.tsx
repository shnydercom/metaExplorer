import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { AppRoot, rootSetup,
	 changeMainAppItpt, 
	 appItptRetrFn, SingleImageSelectorName, ITPT_TAG_ATOMIC, createLDUINSUrl, LDDict } from '@metaexplorer/core';
import { MDSingleImageSelector } from './MDSingleImageSelector';

const createImageObjectAction = createLDUINSUrl(LDDict.CreateAction, LDDict.result, LDDict.ImageObject);

rootSetup([]);
const appIntRetr = appItptRetrFn();
appIntRetr.addItpt(createImageObjectAction, MDSingleImageSelector, "cRud", [ITPT_TAG_ATOMIC]);
changeMainAppItpt(SingleImageSelectorName);
const stories = storiesOf('material design components', module);
stories.add('SingleImageSelector', () => (
	<AppRoot />
));