import * as React from 'react';
import { storiesOf } from "@storybook/react";
import {
	AppRoot, rootSetup,
	changeMainAppItpt,
	appItptRetrFn, ITPT_TAG_ATOMIC, KVL,  LDUIDictVerbs
} from '@metaexplorer/core';
import { MD_SIMPLE_TEXT_TABLE_NAME, MD_SIMPLE_TEXT_TABLE_CFG, MDSimpleTextTable } from './MDSimpleTextTable';


rootSetup([]);
const appIntRetr = appItptRetrFn();
appIntRetr.addItpt(MD_SIMPLE_TEXT_TABLE_CFG.canInterpretType, MDSimpleTextTable, "cRud", [ITPT_TAG_ATOMIC]);

const textTableKvStores: KVL[] = [
	{ key: LDUIDictVerbs.headings, value: ["heading 1", "heading 2", "heading 3"], ldType: undefined },
	{ key: LDUIDictVerbs.tuples, value: [
		["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"], ["j", "k", "l"]
	], ldType: undefined }
]

const stories = storiesOf('material design components', module);
stories.add('SimpleTextTable', () => {
	console.log("table")
	changeMainAppItpt(MD_SIMPLE_TEXT_TABLE_NAME, textTableKvStores);
	return (
		<AppRoot />
	)
}
);