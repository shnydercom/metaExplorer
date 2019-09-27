import {
	ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap, IKvStore,
	LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState, VisualKeysDict, ILDOptions,
	LDDict, gdsfpLD, initLDLocalState
} from "@metaexplorer/core";
import { Component } from "react";
import React from "react";

export const QRCodeDisplayName = "qr/QRCodeDisplay";
export const QRCodeDisplayStngTypeNumber = "qr/typeNumber";
export const QRCodeDisplayStngErrorCorrectionLevel = "qr/correctionLevel";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.utf8textData, QRCodeDisplayStngTypeNumber, QRCodeDisplayStngErrorCorrectionLevel];
let initialKVStores: IKvStore[] = [
	{
		key: VisualKeysDict.utf8textData,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: QRCodeDisplayStngTypeNumber,
		value: undefined,
		ldType: LDDict.Integer,
	},
	{
		key: QRCodeDisplayStngErrorCorrectionLevel,
		value: undefined,
		ldType: LDDict.Text,
	},
];
const bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: QRCodeDisplayName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
export type QRCodeDisplayState = LDLocalState & {
	qr: any;
}

@ldBlueprint(bpCfg)
export class PureQRCodeDisplay extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, QRCodeDisplayState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: QRCodeDisplayState): null | QRCodeDisplayState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], cfgIntrprtKeys);
		if (!rvLD) {
			return null;
		}
		return PureQRCodeDisplay.makeQRpartInState(rvLD);
	}

	public static makeQRpartInState(inputState: LDLocalState): QRCodeDisplayState {
		let rv: QRCodeDisplayState;
		var utf8textData = "Hello";
		var typeNumber = 4;
		var correctionLevel = 'L';

		const localValues = inputState.localValues;
		utf8textData = localValues.get(VisualKeysDict.utf8textData);
		typeNumber = localValues.get(QRCodeDisplayStngTypeNumber);
		correctionLevel = localValues.get(QRCodeDisplayStngErrorCorrectionLevel);

		if (typeNumber === undefined || typeNumber === null || typeNumber < 0 || typeNumber > 40) {
			typeNumber = 0;
		}
		switch (correctionLevel) {
			case "L":
				break;
			case "M":
				break;
			case "Q":
				break;
			case "H":
				break;
			default:
				correctionLevel = "L";
				break;
		}

		if(!utf8textData) utf8textData = "no data";

		var qr = qrcode(typeNumber as TypeNumber, correctionLevel as ErrorCorrectionLevel);
		qr.addData(utf8textData);
		qr.make();
		rv = { ...inputState, qr };
		return rv;
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	styleClassName: string;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props,
			[],
			cfgIntrprtKeys);
		this.state = PureQRCodeDisplay.makeQRpartInState(ldState);
	}
	render() {
		const { qr } = this.state;
		return <div id="qr-gen-target" dangerouslySetInnerHTML={qr ? { __html: qr.createImgTag() } : { __html: "" }}>
		</div>;
	}
}
