import { LDRetrieverSuper, ILDOptions, IKvStore, LDDict, BlueprintConfig, ldBlueprint, UserDefDict, isObjPropertyRef } from "@metaexplorer/core";
import { GoogleWebAuthAPI, EVENT_GOOGLE_WEB_AUTH } from "../apis/GoogleWebAuthAPI";

//import { sheets_v4 } from "googleapis";
//import { GlobalOptions } from "googleapis/build/src/shared/src";

export const gSheetsRangeRetrieverName = "google-api/sheets/rangeRetriever";
export const googleDocID = "googleDocID";
export const sheetName = "sheetName";
export const spreadSheetRange = "range";
export const spreadSheetData = "data";
export const rangeRetrItptKeys = [googleDocID, sheetName, spreadSheetRange];
let ownKVL: IKvStore[] = [
	{
		key: googleDocID,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: sheetName,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: spreadSheetRange,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: spreadSheetData,
		value: undefined,
		ldType: undefined
	}
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: gSheetsRangeRetrieverName,
	ownKVL: ownKVL,
	inKeys: rangeRetrItptKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class GSheetsRetriever extends LDRetrieverSuper {
	gsApi: gapi.client.sheets.SpreadsheetsResource;

	constructor() {
		super();
		this.apiCallOverride = () => new Promise((resolve, reject) => {
			resolve("apiCallOverride still initial");
		});
		this.initGSApi();
		// https://developers.google.com/sheets/api/quickstart/js
	}

	initGSApi = () => {
		if (!this.gsApi) {
			let isGapiAccessible = false;
			try {
				isGapiAccessible = gapi !== undefined;
			} catch (error) {
				//
			}
			if (isGapiAccessible) {
				try {
					this.gsApi = gapi.client["sheets"].spreadsheets;
				} catch (error) {
					if (gapi.client) {
						gapi.client.load('sheets', 'v4', () => {
							this.gsApi = gapi.client["sheets"].spreadsheets;
						});
					}
				}
			} else {
				let gwApi = GoogleWebAuthAPI.getSingleton();
				gwApi.addEventListener(EVENT_GOOGLE_WEB_AUTH,
					(event) => {
						if (event.newState !== "preAPIDownload"
							&& event.newState !== "downloadingAPI"
							&& event.newState !== "downloadAPIFailed"
						) {
							try {
								this.gsApi = gapi.client["sheets"].spreadsheets;
							} catch (error) {
								gapi.client.load('sheets', 'v4', () => {
									this.gsApi = gapi.client["sheets"].spreadsheets;
								});
							}
						}
					});
			}
		}
	}

	/**
	 * fn same as super-class, but uses rangeRetrItptKeys instead of super-class-keys
	 */
	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions || !ldOptions.resource || !ldOptions.resource.kvStores) return;
		this.retrieverStoreKey = ldOptions.ldToken.get();
		let kvs = ldOptions.resource.kvStores;
		let outputKVMap: IKvStore = kvs.find((val) => UserDefDict.outputKVMapKey === val.key);
		outputKVMap = outputKVMap ? outputKVMap : this.cfg.ownKVL.find((val) => UserDefDict.outputKVMapKey === val.key);
		this.setOutputKVMap(outputKVMap && outputKVMap.value ? outputKVMap.value : this.outputKVMap);
		for (let inputidx = 0; inputidx < rangeRetrItptKeys.length; inputidx++) {
			const inputKey = rangeRetrItptKeys[inputidx];
			let param = kvs.find((val) => val.key === inputKey);
			if (param && param.value !== null && !isObjPropertyRef(param.value)
				&& JSON.stringify(param) !== JSON.stringify(this.inputParams.get(inputKey))) {
				this.inputParams.set(inputKey, param);
				this.isInputDirty = true;
			}
		}
		//this.setSrvUrl(srvUrlKv && srvUrlKv.value ? srvUrlKv.value : this.srvUrl);
		//this.setIdentifier(identifier && identifier.value !== null ? identifier : this.identifier);
		this.setWebContent(ldOptions);
		//all input parameters have to have been set in order for the dirty input to be re-evaluated:
		let idx = 0;
		for (idx = 0; idx < rangeRetrItptKeys.length; idx++) {
			const inputKey = rangeRetrItptKeys[idx];
			if (!this.inputParams.has(inputKey)) break;
		}
		if (idx === rangeRetrItptKeys.length) {
			this.evalDirtyInput();
		}
		this.evalDirtyOutput();
	}

	callToAPI(uploadData?: ILDOptions, targetUrl?: string, targetReceiverLnk?): void {
		this.updateAPIcallOverride();
		if (this.apiCallOverride !== null) {
			super.callToAPI(uploadData, targetUrl, targetReceiverLnk);
		}
	}

	setWebContent = (value: ILDOptions) => {
		if (value.isLoading) return;
		if (value.resource.webInResource
			&& value.resource.webInResource[spreadSheetData]
			&& JSON.stringify(value.resource.webInResource) !== JSON.stringify(this.webContent)) {
			this.webContent = value.resource.webInResource;
			this.isOutputDirty = true;
		}
	}

	updateAPIcallOverride = () => {
		if (this.gsApi) {
			let spreadsheetIdKv = this.inputParams.get(googleDocID);
			let subSheetKv: IKvStore = this.inputParams.get(sheetName);
			let rangeKv: IKvStore = this.inputParams.get(spreadSheetRange);
			let spreadsheetId = spreadsheetIdKv.value; //'1HL-Zf9NKxuo03SVlcMGQk22I5ZhGq3CD4nX9k12TBLA';
			let subSheet: string = subSheetKv.value; //'History';
			let range: string = rangeKv.value; // 'A1:I';
			this.apiCallOverride = () => new Promise((resolve, reject) => {
				this.gsApi.values.get({
					spreadsheetId: spreadsheetId, // example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
					range: subSheet + '!' + range,
				}).then((response) => {
					resolve({ [spreadSheetData]: response.result.values });
				}, (response) => {
					reject('Error: ' + response.result.error.message);
				});
			});
		}
	}
}
