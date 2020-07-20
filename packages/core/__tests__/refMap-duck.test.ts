//import jasmine from 'jasmine';

import * as refMapAHeadjson from '../testing/refMapAHead.json';
import { ILDToken, NetworkPreferredToken } from '../src/ldaccess/ildtoken';
import { ILDOptions } from '../src/ldaccess/ildoptions';
import { KVL } from '../src/ldaccess/KVL';
import { BlueprintConfig } from '../src/ldaccess/ldBlueprint';
import { DEFAULT_ITPT_RETRIEVER_NAME } from '../src/defaults/DefaultItptRetriever';
import { ILDOptionsMapStatePart } from '../src/appstate/store';
import { RefMapAction, refMapREQUESTAction, refMapReducer } from '../src/appstate/epicducks/refMap-duck';
import { ldOptionsDeepCopy } from '../src/ldaccess/ldUtils';

let testTokenStr: string = "testRefMapTokenString";
let testToken: ILDToken = new NetworkPreferredToken(testTokenStr);
let testLang: string = "en";

let kvStoresA: KVL[] = [{ key: null, value: null, ldType: "AName-ObjectType" }];

let refMapAHead: BlueprintConfig = refMapAHeadjson as any;

let startALDOptions: ILDOptions = {
	isLoading: false,
	resource: {
		webInResource: null,
		webOutResource: null,
		kvStores: kvStoresA
	},
	lang: testLang,
	ldToken: testToken,
	visualInfo: { retriever: DEFAULT_ITPT_RETRIEVER_NAME }
};

describe("refMap reducer function", () => {
	//let testStartOptionsA: ILDOptions;
	let startStore: ILDOptionsMapStatePart;
	let testExecAOptions: ILDOptions;
	let execAAction: RefMapAction;
	beforeEach(() => {
		//testStartOptionsA = ldOptionsDeepCopy(startALDOptions);
		startStore = {
			[testTokenStr]: startALDOptions
		};
		testExecAOptions = ldOptionsDeepCopy(startALDOptions);
		execAAction = refMapREQUESTAction(testExecAOptions, refMapAHead);
	});
	describe("for a RefMaps' options to be spread across the store,...",
		() => {
			it("should fill visualInfo.interpretedBy with the sub-RefMap-Itpt", () => {
				let reducerResult = refMapReducer(startStore, execAAction);
				expect(reducerResult[testTokenStr].visualInfo.interpretedBy === "AName");
			});
		}
	);
});
