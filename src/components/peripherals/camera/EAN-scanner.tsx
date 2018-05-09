import { connect } from 'react-redux';
import { ExplorerState } from 'appstate/store';
import { uploadImgRequestAction } from 'appstate/epicducks/image-upload';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { getKVValue } from 'ldaccess/ldUtils';
import { Component, ComponentClass, StatelessComponent } from 'react';

//TODO: find proper way to include quagga with types, compiling
//import * as QuaggaAll from 'quagga';
// tslint:disable-next-line:no-var-requires
//const Quagga = require('quagga').default;
//const Quagga = QuaggaAll.default;
declare var Quagga: any;

type OwnProps = {
	singleImage;
};
type ConnectedState = {
};

type ConnectedDispatch = {
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});*/

export enum EANScannerStateEnum {
	isLoading = 2,
	isError = 3,
	isScanning = 4,
}

export type EANScannerState = {
	curStep: EANScannerStateEnum,
	vidDeviceList: MediaDeviceInfo[]
};

export const EANScannerName = "shnyder/EANScanner";
let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] =
	[LDDict.name, LDDict.fileFormat, LDDict.contentUrl];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: EANScannerName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class EANScanner extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, EANScannerState>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	loadingImgLink: string = "/dist/static/camera_negative_black.svg";
	errorImgLink: string = "/dist/static/nocamera_negative_black.svg";

	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = {
			vidDeviceList: null,
			curStep: EANScannerStateEnum.isLoading
		};
		if (props) {
			this.handleKVs(props);
		}
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
			//this.consumeLDOptions(nextProps.ldOptions);
		}
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		/*if (ldOptions && ldOptions.resource && ldOptions.resource.kvStores) {
			let kvs = ldOptions.resource.kvStores;
			this.imgLink = getKVValue(getKVStoreByKey(kvs, LDDict.contentUrl));
		}*/
	}

	componentDidMount() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setStateToError();
			return;
		}
		navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				let vidInputList: MediaDeviceInfo[] = [];
				devices.forEach((device) => {
					if (device.kind === "videoinput")
						vidInputList.push(device);
				});
				if (vidInputList.length === 0) {
					this.setStateToError();
					return;
				} else {
					this.startQuagga();
					return;
				}
			})
			.catch((err) => {
				this.setStateToError();
				return;
			});

	}

	startQuagga() {
		Quagga.init({
			inputStream: {
				type: "LiveStream",
				constraints: {
					width: 1024,
					height: 1024,
					facingMode: "environment" // or user
				}
			},
			locator: {
				patchSize: "medium",
				halfSample: true
			},
			numOfWorkers: 4,
			decoder: {
				readers: ["ean_reader"]
			},
			debug: {
				drawBoundingBox: true,
				showFrequency: false,
				drawScanline: true,
				showPattern: false
			},
			locate: true
		}, (err) => {
			if (err) {
				this.setStateToError();
				return;
			}
			this.setState({ curStep: EANScannerStateEnum.isScanning });
			Quagga.start();
		});
		Quagga.onDetected(this.onBarCodeDetected);
	}

	setStateToError() {
		this.setState({ vidDeviceList: null, curStep: EANScannerStateEnum.isError });
	}

	componentWillUnmount() {
		Quagga.offDetected(this.onBarCodeDetected);
		this.setState({ curStep: EANScannerStateEnum.isLoading });
	}

	render() {
		let stateVisLnk = this.loadingImgLink;
		let isDisplayImage: boolean = true;
		switch (this.state.curStep) {
			case EANScannerStateEnum.isError:
				stateVisLnk = this.errorImgLink;
				break;
			case EANScannerStateEnum.isScanning:
				isDisplayImage = false;
				break;
			default:
				break;
		}
		return (
			<div className="ywqd-barcode-reader">
				<div id="interactive" className="viewport" />
				{isDisplayImage ? <img className="ywqd-barcode-image" src={stateVisLnk} height="100px" /> : null}
			</div>
		);
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		//this.imgLink = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, LDDict.contentUrl));
	}

	private onBarCodeDetected(result) {
		console.log("hey, detected!");
		console.dir(result);
		//this.props.onDetected(result);
	}

}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(EANScanner);
