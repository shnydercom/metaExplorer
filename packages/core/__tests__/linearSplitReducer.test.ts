//import jasmine from 'jasmine';
import { ILDOptions } from '../src/ldaccess/ildoptions';
import { DEFAULT_ITPT_RETRIEVER_NAME } from '../src/defaults/DefaultItptRetriever';
import { ILDToken, NetworkPreferredToken, linearLDTokenStr } from '../src/ldaccess/ildtoken';
import { LDDict } from '../src/ldaccess/LDDict';
import { ILDOptionsMapStatePart } from '../src/appstate/store';
import { ldOptionsDeepCopy } from '../src/ldaccess/ldUtils';
import { IKvStore } from '../src/ldaccess/ikvstore';
import { linearReducer, linearSplitRequestAction, LinearSplitAction } from '../src/appstate/epicducks/linearSplit-duck';

let testTokenStr: string = "testTokenString";
let testToken: ILDToken = new NetworkPreferredToken(testTokenStr);
let testLang: string = "en";
let testStartKVStores: IKvStore[] = [
	{ key: "string_firstKey", value: "stringValStart", ldType: LDDict.Text },
	{ key: "double_secondKey", value: 123.456, ldType: LDDict.Double }
];
let linearTestOptions: ILDOptions = {
	isLoading: false,
	resource: {
		webInResource: null,
		webOutResource: null,
		kvStores: testStartKVStores
	},
	lang: testLang,
	ldToken: testToken,
	visualInfo: { retriever: DEFAULT_ITPT_RETRIEVER_NAME }
};

let testDiffKVStores: IKvStore[] = [
	{ key: "string_firstKey", value: "stringValEnd", ldType: LDDict.Text },
	{ key: "double_secondKey", value: 987.654, ldType: LDDict.Double }
];

describe("linear split reducer function", () => {
	let testStartOptions: ILDOptions;
	let startStore: ILDOptionsMapStatePart;
	let testExecOptions: ILDOptions;
	let execAction: LinearSplitAction;
	let secondExecAction: LinearSplitAction;
	beforeEach(() => {
		testStartOptions = ldOptionsDeepCopy(linearTestOptions);
		startStore = {
			[testTokenStr]: linearTestOptions
		};
		testExecOptions = ldOptionsDeepCopy(linearTestOptions);
		testExecOptions.resource.kvStores = testDiffKVStores;
		//makes sure kvstores are immuted
		testExecOptions = ldOptionsDeepCopy(testExecOptions);
		execAction = linearSplitRequestAction(testExecOptions);
		secondExecAction = linearSplitRequestAction(ldOptionsDeepCopy(testExecOptions));
	});

	describe("for an ldOptions-Obj to be split...", () => {
		expect(testStartOptions).toBe(undefined);
		it("nothing should happen if it's loading", () => {
			execAction.ldOptionsBase.isLoading = true;
			let reducerResult = linearReducer(startStore, execAction);
			expect(reducerResult[testTokenStr].resource.kvStores[0].value).toBe("stringValStart");
			expect(reducerResult[testTokenStr].resource.kvStores[1].value).toBe(123.456);
		});
		it("something should happen if it's not loading and kvStores are different", () => {
			execAction.ldOptionsBase.isLoading = false;
			let reducerResult = linearReducer(startStore, execAction);
			expect(reducerResult[testTokenStr].resource.kvStores[0].value === "stringValStart").toBeFalsy();
			expect(reducerResult[testTokenStr].resource.kvStores[1].value === 123.456).toBeFalsy();
		});
		it("should generate new LDOptions with new values", () => {
			execAction.ldOptionsBase.isLoading = false;
			let reducerResult = linearReducer(startStore, execAction);
			expect(reducerResult[linearLDTokenStr(testTokenStr, 0)].resource.kvStores[0].value).toBe("stringValEnd");
			expect(reducerResult[linearLDTokenStr(testTokenStr, 1)].resource.kvStores[0].value).toBe(987.654);
		});
		it("should add new LDOptions with new values to existing", () => {
			execAction.ldOptionsBase.isLoading = false;
			let reducerResult = linearReducer(startStore, execAction);
			let startKVStoresPlusOne: IKvStore[] = [
				{ key: "string_latestKey", value: "stringValNew", ldType: LDDict.Text }, ...testStartKVStores];
			secondExecAction.ldOptionsBase.resource.kvStores = startKVStoresPlusOne;
			reducerResult = linearReducer(reducerResult, secondExecAction);
			expect(reducerResult[linearLDTokenStr(testTokenStr, 0)].resource.kvStores[0].value).toBe("stringValNew");
			expect(reducerResult[linearLDTokenStr(testTokenStr, 1)].resource.kvStores[0].value).toBe("stringValStart");
			expect(reducerResult[linearLDTokenStr(testTokenStr, 2)].resource.kvStores[0].value).toBe(123.456);
		});

		it("should remove LDOptions when base-ldOptions-kvStore is smaller", () => {
			execAction.ldOptionsBase.isLoading = false;
			let reducerResult = linearReducer(startStore, execAction);
			let smallerKvStores: IKvStore[] = [{ key: "another_key", value: 345.678, ldType: LDDict.Double }];
			secondExecAction.ldOptionsBase.resource.kvStores = smallerKvStores;
			expect(reducerResult[testTokenStr].resource.kvStores.length).toBe(2);
			reducerResult = linearReducer(reducerResult, secondExecAction);
			expect(reducerResult[testTokenStr].resource.kvStores.length).toBe(1);
			expect(reducerResult[linearLDTokenStr(testTokenStr, 0)].resource.kvStores[0].value).toBe(345.678);
			expect(reducerResult[linearLDTokenStr(testTokenStr, 1)]).toBeUndefined();
		});

		it("should remove new LDOptions when the base object changes", () => {
			execAction.ldOptionsBase.isLoading = false;
			let reducerResult = linearReducer(startStore, execAction);
			secondExecAction.ldOptionsBase.resource.kvStores = [];
			reducerResult = linearReducer(reducerResult, secondExecAction);
			expect(reducerResult[linearLDTokenStr(testTokenStr, 0)]).toBeUndefined();
			expect(reducerResult[linearLDTokenStr(testTokenStr, 1)]).toBeUndefined();
		});
	});
});
