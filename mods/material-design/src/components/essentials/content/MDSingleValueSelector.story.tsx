import * as React from 'react';
import { storiesOf } from "@storybook/react";
import {
	AppRoot, rootSetup,
	changeMainAppItpt,
	appItptRetrFn, ITPT_TAG_ATOMIC, LDDict, LDUIDict
} from '@metaexplorer/core';
import { MDSingleValueSelector, MD_SINGLE_VALUE_SELECTOR_NAME, MD_SINGLE_VALUE_SELECTOR_CFG } from './MDSingleValueSelector';

rootSetup([]);
const appIntRetr = appItptRetrFn();
appIntRetr.addItpt(MD_SINGLE_VALUE_SELECTOR_CFG.canInterpretType, MDSingleValueSelector, "cRud", [ITPT_TAG_ATOMIC]);
//appIntRetr.addItpt(MD_SIMPLE_TEXT_TABLE_CFG.canInterpretType, MDSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

const stories = storiesOf('material design components', module);
stories.add('SingleValueSelector|empty', () => {
	changeMainAppItpt(MD_SINGLE_VALUE_SELECTOR_NAME);
	return (
		<AppRoot />
	)
}
).add('SingleValueSelector|filled', () => {
	changeMainAppItpt(MD_SINGLE_VALUE_SELECTOR_NAME,
		[
			{
				key: LDDict.description,
				value: "The brewery example comes from http://schema.org/ChooseAction",
				ldType: LDDict.Text
			},
			{
				key: LDDict.actionOption,
				value: [
					{
						"@type": "Brewery",
						"name": "Dogfish Head"
					},
					{
						"@type": "Brewery",
						"name": "Russian River"
					}
				],
				ldType: LDUIDict.NTuple
			},
			{
				key: LDDict.object,
				value: {
					"@type": "Brewery",
					"name": "Dogfish Head"
				},
				ldType: LDUIDict.OneTuple
			}
		]
	);
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