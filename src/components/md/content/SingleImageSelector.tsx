import Dropzone, { ImageFile } from 'react-dropzone';
import { Component, ComponentClass, StatelessComponent } from 'react';
import { LDConnectedDispatch, LDConnectedState, LDOwnProps, LDLocalState } from 'appstate/LDProps';
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from 'ldaccess/ldBlueprint';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import { compNeedsUpdate } from '../../reactUtils/compUtilFns';
import { ILDOptions } from 'ldaccess/ildoptions';
import { getKVValue } from 'ldaccess/ldUtils';
import { getKVStoreByKeyFromLDOptionsOrCfg } from 'ldaccess/kvConvenienceFns';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapDispatchToProps, mapStateToProps } from 'appstate/reduxFns';
import { connect } from 'react-redux';
import { Button } from 'react-toolbox/lib/button';
import { DOMCamera } from '../../peripherals/camera/dom-camera';
import { initLDLocalState, getDerivedKVStateFromProps } from '../../generic/generatorFns';
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

export const SingleImageSelectorName = "shnyder/md/SingleImageSelector";
let cfgType: string = LDDict.CreateAction;
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
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: SingleImageSelectorName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureSingleImageSelector extends Component<
LDConnectedState & LDConnectedDispatch & LDOwnProps,
SingleImageSelectorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SingleImageSelectorState): null | SingleImageSelectorState {
		let rvLD = getDerivedKVStateFromProps(nextProps, prevState, [UserDefDict.outputKVMapKey]);
		if (rvLD === null || rvLD === prevState) return null;
		return { ...prevState, ...rvLD };
	}

	cfg: BlueprintConfig;
	//outputKVMap: OutputKVMap;
	loadingImgLink: string = "/dist/static/camera_negative_black.svg";
	errorImgLink: string = "/dist/static/nocamera_negative_black.svg";
	draggingImgLink: string = "/dist/static/dragndrop.svg";

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
		/*if (props) {
			this.handleKVs(props);
		}*/
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

	/*componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
			//this.consumeLDOptions(nextProps.ldOptions);
		}
	}*/
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

	render() {
		const { curStep, isCamAvailable, previewURL } = this.state;
		let dropzoneRef;
		return (<Dropzone className="single-img-sel"
			accept="image/*"
			multiple={false}
			disableClick={true}
			ref={(node) => { dropzoneRef = node; }}
			onDropAccepted={(acceptedOrRejected) => this.onDropSuccess(acceptedOrRejected[0], acceptedOrRejected[0].preview)}
			onDropRejected={() => this.onDropFailure()}
			onDragStart={() => this.startDrag()}
			onDragEnter={() => this.startDrag()}
			onDragOver={() => this.startDrag()}
			onDragLeave={() => this.onDropFailure()}
			onFileDialogCancel={() => this.onDropFailure()}
			>
			{(() => {
				switch (curStep) {
					case SingleImageSelectorStateEnum.isSelectInputType:
						return <> {isCamAvailable ? <Button className="btn-extension" icon="add_a_photo" onClick={() => { this.startCamera(); }}>Open Camera</Button> : null}
							<Button className="btn-extension" icon="add_photo_alternate" onClick={() => { dropzoneRef.open(); }}>Select Image</Button></>;
					case SingleImageSelectorStateEnum.isCamShooting:
						return <DOMCamera onImageCaptured={(a) => {
							this.onDropSuccess(null, a);
						}} />;
					case SingleImageSelectorStateEnum.isDragging:
						return <img className="md-large-image" src={this.draggingImgLink} height="100px" />;
					case SingleImageSelectorStateEnum.isPreviewing:
						return <img className="cover-img" src={previewURL} alt="image preview" ></img>;
					case SingleImageSelectorStateEnum.isError:
						return <span>isError</span>;
					default:
						return null;
				}
			})()}
		</Dropzone >);
	}

	/*private handleKVs(props: LDOwnProps & LDConnectedState) {
		let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
		this.outputKVMap = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, UserDefDict.outputKVMapKey));
		//this.imgLink = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, LDDict.contentUrl));
	}*/

}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureSingleImageSelector);
