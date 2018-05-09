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
import { CameraSwitcherTabs } from './cameraSwitcherTabs';

//TODO: find proper way to include quagga with types, compiling
//import * as Quagga from 'quagga';
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
	vidDeviceList: MediaDeviceInfo[],
	curId: string
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
			curId: null,
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
					const deviceId = vidInputList[0].deviceId;
					this.setState({ curId: deviceId, curStep: EANScannerStateEnum.isLoading, vidDeviceList: vidInputList });
					this.startQuagga(deviceId);
					return;
				}
			})
			.catch((err) => {
				this.setStateToError();
				return;
			});

	}

	startQuagga(deviceId: string) {
		Quagga.init({
			inputStream: {
				type: "LiveStream",
				constraints: {
					width: 1024,
					height: 1024,
					deviceId: deviceId,
					facingMode: "environment" // or user
				}
			},
			debug: true,
			locator: {
				patchSize: "medium",
				halfSample: true,
				/*debug: {
					showCanvas: true,
					showPatches: true,
					showFoundPatches: true,
					showSkeleton: true,
					showLabels: true,
					showPatchLabels: true,
					showRemainingPatchLabels: true,
					boxFromPatches: {
						showTransformed: true,
						showTransformedBox: true,
						showBB: true,
					}
				}*/
			},
			numOfWorkers: 4,
			decoder: {
				readers: ["ean_reader"], // 'code_128_reader'
				/*debug: {
					drawBoundingBox: true,
					showFrequency: true,
					drawScanline: true,
					showPattern: true
				},*/
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
		this.setState({ vidDeviceList: null, curId: null, curStep: EANScannerStateEnum.isError });
	}

	componentWillUnmount() {
		Quagga.offDetected(this.onBarCodeDetected);
		this.setState({ curStep: EANScannerStateEnum.isLoading, vidDeviceList: null, curId: null });
	}

	render() {
		let stateVisLnk = this.loadingImgLink;
		const { curStep, curId, vidDeviceList } = this.state;
		let isDisplayImage: boolean = true;
		const isMultiVidSource: boolean = vidDeviceList && vidDeviceList.length > 1;
		switch (curStep) {
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
				{isDisplayImage ?
					<img className="ywqd-barcode-image" src={stateVisLnk} height="100px" /> :
					isMultiVidSource ?
						<CameraSwitcherTabs activeCameraId={curId} vidDeviceList={vidDeviceList} onTabChanged={(newActiveId) => {
							Quagga.offDetected(this.onBarCodeDetected);
							Quagga.stop();
							this.setState({ ...this.state, curId: newActiveId, curStep: EANScannerStateEnum.isLoading });
							this.startQuagga(newActiveId);
						}} /> :
						null
				}
			</div>
		);
	}

	onCamTabChanged(newActiveId: string) {
		Quagga.offDetected(this.onBarCodeDetected);
		Quagga.stop();
		this.setState({ ...this.state, curId: newActiveId, curStep: EANScannerStateEnum.isLoading });
		this.startQuagga(newActiveId);
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
