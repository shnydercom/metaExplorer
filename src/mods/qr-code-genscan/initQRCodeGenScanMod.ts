import appItptRetrFn from "appconfig/appItptRetriever";
import { QrCodeGenScanClientAPI } from "./apis/qr-code-genscan-api";
import { IModStatus, SingleModStateKeysDict } from "appstate/modstate";
import { ITPT_TAG_ATOMIC } from "ldaccess/iitpt-retriever";
import { QRCodeDisplayName, PureQRCodeDisplay } from "./components/qr-code-display";
import { QRCodeScanner, QRCodeScannerName } from "./components/qr-code-scanner";

export const MOD_QRCODEGENSCAN_ID = "QRCODEGEN";
export const MOD_QRCODEGENSCAN_NAME = "QR Code Generator and Scanner Mod";

export function initQRCODEGENClientMod(): Promise<IModStatus> {
	const appIntRetr = appItptRetrFn();
	const rv: Promise<IModStatus> = new Promise((resolve, reject) => {
		QrCodeGenScanClientAPI.getQrCodeGenScanAPISingleton().then((a) => {
			appIntRetr.addItpt(QRCodeDisplayName, PureQRCodeDisplay, "cRud", [ITPT_TAG_ATOMIC]);
			appIntRetr.addItpt(QRCodeScannerName, QRCodeScanner, "cRud", [ITPT_TAG_ATOMIC]);
			resolve({ id: MOD_QRCODEGENSCAN_ID, name: MOD_QRCODEGENSCAN_NAME, state: SingleModStateKeysDict.readyToUse, errorMsg: null });
		}).catch((reason) => {
			reject(reason);
		});
	});
	return rv;
}
