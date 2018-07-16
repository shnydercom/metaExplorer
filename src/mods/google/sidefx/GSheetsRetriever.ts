import { sheets_v4 } from "googleapis";
import { GlobalOptions } from "googleapis/build/src/shared/src";

class GSheetsRetriever {
	gsApi: sheets_v4.Sheets;
	constructor() {
		const config: GlobalOptions = {
		};
		// https://developers.google.com/sheets/api/quickstart/js
		this.gsApi = new sheets_v4.Sheets(config);
	}
}
