import * as React from 'react';
import { storiesOf } from "@storybook/react";
import {
	AppRoot, rootSetup,
	changeMainAppItpt,
	appItptRetrFn, ITPT_TAG_ATOMIC
} from '@metaexplorer/core';
import { MDSingleImageSelector, MD_SINGLE_IMAGE_SELECTOR_NAME, MD_SINGLE_IMAGE_SELECTOR_CFG } from './MDSingleImageSelector';


//import { MD_SIMPLE_TEXT_TABLE_NAME, MD_SIMPLE_TEXT_TABLE_CFG, MDSimpleTextTable } from './MDSimpleTextTable';

rootSetup([]);
const appIntRetr = appItptRetrFn();
appIntRetr.addItpt(MD_SINGLE_IMAGE_SELECTOR_CFG.canInterpretType, MDSingleImageSelector, "cRud", [ITPT_TAG_ATOMIC]);
//appIntRetr.addItpt(MD_SIMPLE_TEXT_TABLE_CFG.canInterpretType, MDSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

const stories = storiesOf('material design components', module);
stories.add('SingleImageSelector', () => {

	changeMainAppItpt(MD_SINGLE_IMAGE_SELECTOR_NAME);
	return (
		<AppRoot />
	)
}
);
/*

stories.add('SimpleTextTable', () => {
	changeMainAppItpt(MD_SIMPLE_TEXT_TABLE_NAME);
	return (
		<AppRoot />
	)
}
);*/