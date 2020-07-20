import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
// TODO: fix unexpected ... 'export' error coming from ts-jest/jest/jest-babel
/*import { LDDict } from '@metaexplorer/core/lib/ldaccess/lddict';
/*
export const DEFAULT_MXP_SCALARS: NormalizedScalarsMap = {
	ID: LDDict.Text,
	String: LDDict.Text,
	Boolean: LDDict.Boolean,
	Int: LDDict.Integer,
	Float: LDDict.Double,
};
*/
export const DEFAULT_MXP_SCALARS: NormalizedScalarsMap = {
	ID: "LDDict.Text",
	String: "LDDict.Text",
	Boolean: "LDDict.Boolean",
	Int: "LDDict.Integer",
	Float: "LDDict.Double",
};
