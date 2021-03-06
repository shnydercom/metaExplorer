import {
	LDDict,
	KVL,
	ldBlueprint,
	BlueprintConfig,
	IBlueprintItpt,
	OutputKVMap,
	LDConnectedState,
	LDConnectedDispatch,
	LDOwnProps,
	LDLocalState,
	ILDOptions,
	CameraSwitcherTabs,
	UserDefDict,
	initLDLocalState,
} from "@metaexplorer/core";
import { QrCodeGenScanClientAPI } from "../apis/qr-code-genscan-api";
import { Component } from "react";
import React from "react";

//TODO: find proper way to include quagga with types, compiling
//import * as Quagga from 'quagga';
// tslint:disable-next-line:no-var-requires
//const Quagga = require('quagga').default;
//const Quagga = QuaggaAll.default;
declare var Quagga: any;

export enum EANScannerStateEnum {
	isLoading = 2,
	isError = 3,
	isScanning = 4,
}

export interface EANScannerState extends LDLocalState {
	curStep: EANScannerStateEnum;
	vidDeviceList: MediaDeviceInfo[];
	curId: string;
}

export const EANScannerName = "metaexplorer.io/EANScanner";
let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] = [];
let ownKVLs: KVL[] = [
	{
		key: LDDict.gtin8,
		value: undefined,
		ldType: LDDict.Text,
	},
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: EANScannerName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud",
};

@ldBlueprint(bpCfg)
export class EANScanner
	extends Component<
		LDConnectedState & LDConnectedDispatch & LDOwnProps,
		EANScannerState
	>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	loadingImgLink: string = "/media/camera_negative_black.svg";
	errorImgLink: string = "/media/nocamera_negative_black.svg";

	ownKVLs: KVL[];
	constructor(props: any) {
		super(props);
		this.cfg = this.constructor["cfg"] as BlueprintConfig;
		const ldState = initLDLocalState(
			this.cfg,
			props,
			[],
			[UserDefDict.outputKVMapKey]
		);
		this.state = {
			...ldState,
			vidDeviceList: null,
			curId: null,
			curStep: EANScannerStateEnum.isLoading,
		};
	}

	componentDidMount() {
		if (
			!navigator.mediaDevices ||
			!navigator.mediaDevices.enumerateDevices
		) {
			this.setStateToError();
			return;
		}
		navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				let vidInputList: MediaDeviceInfo[] = [];
				devices.forEach((device) => {
					if (device.kind === "videoinput") vidInputList.push(device);
				});
				if (vidInputList.length === 0) {
					this.setStateToError();
					return;
				} else {
					const deviceId = vidInputList[0].deviceId;
					this.setState({
						...this.state,
						curId: deviceId,
						curStep: EANScannerStateEnum.isLoading,
						vidDeviceList: vidInputList,
					});
					this.initQuagga(deviceId);
					return;
				}
			})
			.catch((err) => {
				this.setStateToError();
				return;
			});
	}

	async initQuagga(deviceId: string) {
		if (!("Quagga" in window)) {
			try {
				const qrAPI = await QrCodeGenScanClientAPI.getQrCodeGenScanAPISingleton();
				await qrAPI.initQuaggaScriptLoad();
				this.startQuagga(deviceId);
			} catch (e) {
				throw e;
			}
			return;
		}
		this.startQuagga(deviceId);
	}
	startQuagga(deviceId: string) {
		Quagga.init(
			{
				inputStream: {
					type: "LiveStream",
					constraints: {
						width: 1024,
						height: 1024,
						deviceId: deviceId,
						facingMode: "environment", // or user
					},
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
				locate: true,
			},
			(err) => {
				if (err) {
					this.setStateToError();
					return;
				}
				this.setState({
					...this.state,
					curStep: EANScannerStateEnum.isScanning,
				});
				Quagga.start();
			}
		);
		Quagga.onDetected(this.onBarCodeDetected);
	}

	setStateToError() {
		this.setState({
			...this.state,
			vidDeviceList: null,
			curId: null,
			curStep: EANScannerStateEnum.isError,
		});
	}

	componentWillUnmount() {
		if (!Quagga) return;
		Quagga.offDetected(this.onBarCodeDetected);
		if (
			this.state.curStep !== EANScannerStateEnum.isError &&
			this.state.curId !== null
		) {
			Quagga.stop();
		}
		this.setState({
			...this.state,
			curStep: EANScannerStateEnum.isLoading,
			vidDeviceList: null,
			curId: null,
		});
	}

	render() {
		let stateVisLnk = this.loadingImgLink;
		const { curStep, curId, vidDeviceList } = this.state;
		let isDisplayImage: boolean = true;
		const isMultiVidSource: boolean =
			vidDeviceList && vidDeviceList.length > 1;
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
			<div className="md-barcode-reader">
				<div id="interactive" className="viewport" />
				{isDisplayImage ? (
					<img
						className="md-large-image"
						src={stateVisLnk}
						height="100px"
					/>
				) : isMultiVidSource ? (
					<CameraSwitcherTabs
						activeCameraId={curId}
						vidDeviceList={vidDeviceList}
						onTabChanged={(newActiveId) => {
							Quagga.offDetected(this.onBarCodeDetected);
							Quagga.stop();
							this.setState({
								...this.state,
								curId: newActiveId,
								curStep: EANScannerStateEnum.isLoading,
							});
							this.initQuagga(newActiveId);
						}}
					/>
				) : null}
			</div>
		);
	}

	private onBarCodeDetected = (result) => {
		const outputKVMap = this.state.localValues.get(
			UserDefDict.outputKVMapKey
		);
		if (!outputKVMap) return;
		let barcode: string = result.codeResult.code;
		const barcodeKV: KVL = {
			key: LDDict.gtin8,
			value: barcode,
			ldType: LDDict.Text,
		};
		this.props.dispatchKvOutput(
			[barcodeKV],
			this.props.ldTokenString,
			outputKVMap
		);
	};
}
