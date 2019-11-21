import { Component, ReactNode } from 'react';
import { LDConnectedDispatch, LDConnectedState, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';
import { BlueprintConfig, IBlueprintItpt } from '../../../ldaccess/ldBlueprint';
import { LDDict } from '../../../ldaccess/LDDict';
import { IKvStore } from '../../../ldaccess/ikvstore';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { UserDefDict } from '../../../ldaccess/UserDefDict';
import { initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { createLDUINSUrl } from '../../../ldaccess/ldUtils';
// TODO: drop file anim: https://css-tricks.com/examples/DragAndDropFileUploading/

export enum SingleImageSelectorStateEnum {
	isSelectInputType = 2,
	isDragging = 3,
	isCamShooting = 4,
	isPreviewing = 5,
	isError = 6
}

export interface SingleImageSelectorState extends LDLocalState {
	curStep: SingleImageSelectorStateEnum;
	isCamAvailable: boolean;
	previewURL: string;
}

export const SingleImageSelectorName = "metaexplorer.io/material-design/SingleImageSelector";
let cfgType: string = createLDUINSUrl(LDDict.CreateAction, LDDict.result, LDDict.ImageObject);
let cfgIntrprtKeys: string[] =
	[];
const RESULT_KV: IKvStore = {
	key: LDDict.result,
	value: undefined,
	ldType: LDDict.URL
};
let initialKVStores: IKvStore[] = [
	RESULT_KV
];
export let SingleImageSelectorBpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: SingleImageSelectorName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export abstract class AbstractSingleImageSelector extends Component<
	LDConnectedState & LDConnectedDispatch & LDOwnProps,
	SingleImageSelectorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SingleImageSelectorState): null | SingleImageSelectorState {
		let rvLD = gdsfpLD(nextProps, prevState, [], [UserDefDict.outputKVMapKey]);
		if (rvLD === null || rvLD === prevState) return null;
		return { ...prevState, ...rvLD };
	}

	cfg: BlueprintConfig;
	loadingImgLink: string = "/media/camera_negative_black.svg";
	errorImgLink: string = "/media/nocamera_negative_black.svg";
	draggingImgLink: string = "/media/dragndrop.svg";

	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const baseState = {
			curStep: SingleImageSelectorStateEnum.isSelectInputType,
			isCamAvailable: false,
			previewURL: null
		};
		this.state = {
			...baseState,
			...initLDLocalState(
				this.cfg,
				props,
				[],
				[UserDefDict.outputKVMapKey]
			)
		};
	}

	/**
	 * called when the URL/blob of the image URL changes, dispatches KV-Output
	 */
	onResultChanged(url: string) {
		const outputKV = { ...RESULT_KV, value: url };
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		this.props.dispatchKvOutput([outputKV], this.props.ldTokenString, outputKVMap);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		/*if (ldOptions && ldOptions.resource && ldOptions.resource.kvStores) {
			let kvs = ldOptions.resource.kvStores;
			this.imgLink = getKVValue(getKVStoreByKey(kvs, LDDict.contentUrl));
		}*/
	}

	componentDidMount() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setState({ ...this.state, isCamAvailable: false });
			return;
		} else {
			navigator.mediaDevices.enumerateDevices()
				.then((devices) => {
					let vidInputList: MediaDeviceInfo[] = [];
					devices.forEach((device) => {
						if (device.kind === "videoinput")
							vidInputList.push(device);
					});
					if (vidInputList.length === 0) {
						this.setState({ ...this.state, isCamAvailable: false });
					} else {
						this.setState({ ...this.state, isCamAvailable: true });
					}
				});
		}
	}

	setStateToError() {
		this.setState({ ...this.state, curStep: SingleImageSelectorStateEnum.isError });
	}

	startDrag() {
		if (this.state.curStep !== SingleImageSelectorStateEnum.isPreviewing) {
			this.setState({ ...this.state, curStep: SingleImageSelectorStateEnum.isDragging });
		}
	}

	onDropSuccess(imgFile: File, previewURL: string) {
		this.setState({ ...this.state, curStep: SingleImageSelectorStateEnum.isPreviewing, previewURL: previewURL });
		this.onResultChanged(previewURL);
	}
	onDropFailure() {
		if (this.state.curStep !== SingleImageSelectorStateEnum.isPreviewing) {
			this.setState({ ...this.state, curStep: SingleImageSelectorStateEnum.isSelectInputType });
		}
	}
	startCamera() {
		this.setState({ ...this.state, curStep: SingleImageSelectorStateEnum.isCamShooting });
	}

	destroyPreview() {
		if (this.state.previewURL) {
			window.URL.revokeObjectURL(this.state.previewURL);
		}
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
