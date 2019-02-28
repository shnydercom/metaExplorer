import QrScanner from "qr-scanner";
import QRCodeFactory from "qrcode-generator";

export class QrCodeGenScanClientAPI {

	public static async getScanner(video: HTMLVideoElement, onDecode: (arg) => void, canvasSize?: number) {
		let api = await QrCodeGenScanClientAPI.getQrCodeGenScanAPISingleton();
		QrScanner.WORKER_PATH = 'lib/qr-scanner-worker.min.js@1.1.1.js';
		api.scanner = new QrScanner(video, onDecode, canvasSize);
		api.scanner.start();
	}

	public static async destroyScanner() {
		let api = await QrCodeGenScanClientAPI.getQrCodeGenScanAPISingleton();
		if (api.scanner) api.scanner.destroy();
	}

	public static async getQrCodeGenScanAPISingleton(): Promise<QrCodeGenScanClientAPI> {
		if (QrCodeGenScanClientAPI.genscanSingleton == null) {
			QrCodeGenScanClientAPI.genscanSingleton = await QrCodeGenScanClientAPI.initGenScan();
		}
		return QrCodeGenScanClientAPI.genscanSingleton;
	}

	private static genscanSingleton: QrCodeGenScanClientAPI;
	private static async initGenScan(): Promise<QrCodeGenScanClientAPI> {
		let rv = new QrCodeGenScanClientAPI();
		const genApi = await rv.initGenScriptLoad() as QRCodeFactory;
		await rv.initScanScriptLoad();
		rv.generator = genApi;
		//rv.scanner = scanApi;
		return rv;
	}

	protected generator: QRCodeFactory;
	protected scanner: QrScanner;

	public initGenScriptLoad() {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			document.body.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
			script.async = true;
			script.src = '/lib/qrcode-generator@1.4.3.js';
		});
	}

	public initScanScriptLoad() {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			document.body.appendChild(script);
			script.type = "module";
			script.onload = resolve;
			script.onerror = reject;
			script.async = true;
			script.src = '/lib/qr-scanner@1.1.1.js';
		});
	}

}
