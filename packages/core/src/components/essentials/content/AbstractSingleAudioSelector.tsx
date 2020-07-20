import { Component, ReactNode } from 'react';
import { LDConnectedDispatch, LDConnectedState, LDOwnProps, LDLocalState } from '../../../appstate/LDProps';
import { BlueprintConfig, IBlueprintItpt } from '../../../ldaccess/ldBlueprint';
import { LDDict } from '../../../ldaccess/LDDict';
import { KVL } from '../../../ldaccess/KVL';
import { ILDOptions } from '../../../ldaccess/ildoptions';
import { UserDefDict } from '../../../ldaccess/UserDefDict';
import { initLDLocalState, gdsfpLD } from '../../generic/generatorFns';
import { createLDUINSUrl } from '../../../ldaccess/ldUtils';
// TODO: drop file anim: https://css-tricks.com/examples/DragAndDropFileUploading/

export enum SingleAudioSelectorStateEnum {
	isSelectInputType = 2,
	isDragging = 3,
	isRecording = 4,
	isPreviewing = 5,
	isError = 6
}

export interface SingleAudioSelectorState extends LDLocalState {
	curStep: SingleAudioSelectorStateEnum;
	isMicAvailable: boolean;
	previewURL: string;
}

const SingleAudioSelectorName = "metaexplorer.io/core/SingleAudioSelector";

let cfgType: string = createLDUINSUrl(LDDict.CreateAction, LDDict.result, LDDict.AudioObject);
let cfgIntrprtKeys: string[] =
	[];
const RESULT_KV: KVL = {
	key: LDDict.result,
	value: undefined,
	ldType: LDDict.URL
};
let ownKVLs: KVL[] = [
	RESULT_KV
];
export let SingleAudioSelectorBpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: SingleAudioSelectorName,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

export abstract class AbstractSingleAudioSelector extends Component<
	LDConnectedState & LDConnectedDispatch & LDOwnProps,
	SingleAudioSelectorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SingleAudioSelectorState): null | SingleAudioSelectorState {
		let rvLD = gdsfpLD(nextProps, prevState, [], [UserDefDict.outputKVMapKey]);
		if (rvLD === null || rvLD === prevState) return null;
		return { ...prevState, ...rvLD };
	}

	cfg: BlueprintConfig;

	ownKVLs: KVL[];
	// tslint:disable-next-line:variable-name
	_isMounted: boolean = false;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const baseState = {
			curStep: SingleAudioSelectorStateEnum.isSelectInputType,
			isMicAvailable: false,
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
	 * called when the URL/blob of the audio URL changes, dispatches KV-Output
	 */
	onResultChanged(url: string) {
		const outputKV = { ...RESULT_KV, value: url };
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap) return;
		this.props.dispatchKvOutput([outputKV], this.props.ldTokenString, outputKVMap);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		//
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.setState({ ...this.state, isMicAvailable: false });
			return;
		} else {
			navigator.mediaDevices.enumerateDevices()
				.then((devices) => {
					let vidInputList: MediaDeviceInfo[] = [];
					devices.forEach((device) => {
						if (device.kind === "audioinput")
							vidInputList.push(device);
					});
					if (this._isMounted) {
						if (vidInputList.length === 0) {
							this.setState({ ...this.state, isMicAvailable: false });
						} else {
							this.setState({ ...this.state, isMicAvailable: true });
						}
					}
				});
		}
	}

	setStateToError() {
		this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isError });
	}

	startDrag() {
		if (this.state.curStep !== SingleAudioSelectorStateEnum.isPreviewing) {
			this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isDragging });
		}
	}

	onDropSuccess(audioFile: File, previewURL: string) {
		this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isPreviewing, previewURL: previewURL });
		this.onResultChanged(previewURL);
	}
	onDropFailure() {
		if (this.state.curStep !== SingleAudioSelectorStateEnum.isPreviewing) {
			this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isSelectInputType });
		}
	}
	startMic() {
		this.setState({ ...this.state, curStep: SingleAudioSelectorStateEnum.isRecording });
	}

	/**
	 * revokes the previewURL and sets state.previewURL to null, it does not change state.curStep
	 */
	destroyPreview() {
		if (this.state.previewURL) {
			window.URL.revokeObjectURL(this.state.previewURL);
			this.setState({...this.state, previewURL: null});
		}
	}
	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
