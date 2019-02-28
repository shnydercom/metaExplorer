import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { IKvStore } from "ldaccess/ikvstore";
import { Component } from "react";
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from "appstate/LDProps";
import { ILDOptions } from "ldaccess/ildoptions";
import { VisualKeysDict } from "components/visualcomposition/visualDict";
import { LDDict } from "ldaccess/LDDict";
import { gdsfpLD, initLDLocalState } from "components/generic/generatorFns";

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
export interface QRCodeDisplayState extends LDLocalState {
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
		const { localValues, qr } = this.state;
		return <div id="qr-gen-target" dangerouslySetInnerHTML={qr ? { __html: qr.createImgTag() } : { __html: "" }}>
		</div>;
	}
}
