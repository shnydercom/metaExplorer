//import { sheets_v4 } from "googleapis";
//import { GlobalOptions } from "googleapis/build/src/shared/src";

export class GSheetsRetriever {
	//gsApi: sheets_v4.Sheets;
	constructor() {
		//const config: GlobalOptions = {	};
		// now we can use gapi.client
		// ...
		gapi.client.load('sheets', 'v4', () => {
			// now we can use gapi.client.sheets
			// ...
			let workaround: gapi.client.sheets.SpreadsheetsResource = gapi.client["sheets"].spreadsheets;
			let subSheet: string = 'TimeTracking';
			let range: string = 'A1:I';
			workaround.values.get({
				spreadsheetId: '1HL-Zf9NKxuo03SVlcMGQk22I5ZhGq3CD4nX9k12TBLA', // example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
				range: subSheet + '!' + range,
			}).then((response) => {
				console.dir(response);
			}, (response) => {
				console.log('Error: ' + response.result.error.message);
			});
		});
		// https://developers.google.com/sheets/api/quickstart/js
		//this.gsApi = new sheets_v4.Sheets(config);

	}
}
