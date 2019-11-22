import * as React from 'react';
import { storiesOf } from "@storybook/react";
import {
	AppRoot, rootSetup,
	changeMainAppItpt,
	appItptRetrFn, ITPT_TAG_ATOMIC,
	LD_BASE_DATA_TYPE_INPUT_TYPES
} from '@metaexplorer/core';
import {
	MDBoolInput,
	MDIntInput,
	MDDoubleInput,
	MDTextInput,
	MDDateInput,
	MDDateTimeInput
} from './MDBaseDataTypeInput';
import { createMDModNSUrl } from '../../../mdUtils';


rootSetup([]);
const appIntRetr = appItptRetrFn();
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[0], MDBoolInput, "cRud", [ITPT_TAG_ATOMIC]);
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[1], MDIntInput, "cRud", [ITPT_TAG_ATOMIC]);
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[2], MDDoubleInput, "cRud", [ITPT_TAG_ATOMIC]);
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[3], MDTextInput, "cRud", [ITPT_TAG_ATOMIC]);
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[4], MDDateInput, "cRud", [ITPT_TAG_ATOMIC]);
appIntRetr.addItpt(LD_BASE_DATA_TYPE_INPUT_TYPES[5], MDDateTimeInput, "cRud", [ITPT_TAG_ATOMIC]);

const stories = storiesOf('material design components', module);

stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[0], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[0]), MDBoolInput);
	return (<AppRoot />)
});
stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[1], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[1]), MDIntInput);
	return (<AppRoot />)
});
stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[2], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[2]), MDDoubleInput);
	return (<AppRoot />)
});
stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[3], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[3]), MDTextInput);
	return (<AppRoot />)
});
stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[4], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[4]), MDDateInput);
	return (<AppRoot />)
});
stories.add(LD_BASE_DATA_TYPE_INPUT_TYPES[5], () => {
	changeMainAppItpt(createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[5]), MDDateTimeInput);
	return (<AppRoot />)
});