import { LDLocalState, LDConnectedState, LDConnectedDispatch, LDOwnProps } from "appstate/LDProps";
import { LDDict } from "ldaccess/LDDict";
import { IKvStore } from "ldaccess/ikvstore";
import { VisualKeysDict } from "components/visualcomposition/visualDict";
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { Component } from "react";
import { ILDOptions } from "ldaccess/ildoptions";
import { initLDLocalState } from "components/generic/generatorFns";
import { UserDefDict } from "ldaccess/UserDefDict";
import { DOMCamera } from "components/peripherals/camera/dom-camera";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { QrCodeGenScanClientAPI } from "../apis/qr-code-genscan-api";

/*import QrScanner from 'qr-scanner';

//by webcam
<video></video>

const qrScanner = new QrScanner(videoElem, (result) => console.log('decoded qr code:', result));

//by upload
QrScanner.scanImage(image)
    .then(result => console.log(result))
    .catch(error => console.log(error || 'No QR code found.'));
*/

export enum QRCodeScannerStateEnum {
    isLoading = 2,
    isError = 3,
    isScanning = 4,
}

export interface QRCodeScannerState extends LDLocalState {
    curStep: QRCodeScannerStateEnum;
    vidDeviceList: MediaDeviceInfo[];
    curId: string;
}

export const QRCodeScannerName = "qr/QRCodeScanner";
let cfgType: string = LDDict.ViewAction;
let cfgIntrprtKeys: string[] =
    [];
let initialKVStores: IKvStore[] = [
    {
        key: VisualKeysDict.utf8textData,
        value: undefined,
        ldType: LDDict.Text
    }
];
let bpCfg: BlueprintConfig = {
    subItptOf: null,
    canInterpretType: cfgType,
    nameSelf: QRCodeScannerName,
    initialKvStores: initialKVStores,
    interpretableKeys: cfgIntrprtKeys,
    crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class QRCodeScanner extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, QRCodeScannerState>
    implements IBlueprintItpt {
    cfg: BlueprintConfig;
    outputKVMap: OutputKVMap;
    consumeLDOptions: (ldOptions: ILDOptions) => any;
    loadingImgLink: string = "/static/camera_negative_black.svg";
    errorImgLink: string = "/static/nocamera_negative_black.svg";

    initialKvStores: IKvStore[];
    constructor(props: any) {
        super(props);
        this.cfg = (this.constructor["cfg"] as BlueprintConfig);
        const ldState = initLDLocalState(this.cfg, props, [], [UserDefDict.outputKVMapKey]);
        this.state = {
            ...ldState,
            vidDeviceList: null,
            curId: null,
            curStep: QRCodeScannerStateEnum.isLoading
        };
    }

    setStateToError() {
        this.setState({ ...this.state, vidDeviceList: null, curId: null, curStep: QRCodeScannerStateEnum.isError });
    }

    componentWillUnmount() {
        //Quagga.offDetected(this.onBarCodeDetected);
        if (this.state.curStep !== QRCodeScannerStateEnum.isError && this.state.curId !== null) {
            QrCodeGenScanClientAPI.destroyScanner().then(() => console.log("qr scanner destroyed"));
            //qrScanner = null;
        }
        this.setState({ ...this.state, curStep: QRCodeScannerStateEnum.isLoading, vidDeviceList: null, curId: null });
    }

    render() {
        let stateVisLnk = this.loadingImgLink;
        const { curStep, curId, vidDeviceList } = this.state;
        let isDisplayImage: boolean = true;
        const isMultiVidSource: boolean = vidDeviceList && vidDeviceList.length > 1;
        switch (curStep) {
            case QRCodeScannerStateEnum.isError:
                stateVisLnk = this.errorImgLink;
                break;
            case QRCodeScannerStateEnum.isScanning:
                isDisplayImage = false;
                break;
            default:
                break;
        }
        return (
            <div className="md-barcode-reader" >
                <DOMCamera showControls={false} onVideoDisplayReady={(video) => {
                    QrCodeGenScanClientAPI.getScanner(video, this.onQRCodeDetected).then((scanner) => console.log("qr scanner created"));
                }}
                    onVideoDisplayRemoved={() => {
                        QrCodeGenScanClientAPI.destroyScanner().then(() => console.log("qr scanner destroyed"));
                    }} />
            </div>
        );
    }

    private onQRCodeDetected = (result) => {
        console.log("qr code: " + result);
        const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
        if (!outputKVMap) return;
        let qrcode: string = result;
        const barcodeKV: IKvStore = {
            key: VisualKeysDict.utf8textData,
            value: qrcode,
            ldType: LDDict.Text
        };
        this.props.dispatchKvOutput([barcodeKV], this.props.ldTokenString, outputKVMap);
    }

}
export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(QRCodeScanner);
