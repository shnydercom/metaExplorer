import { LDDict } from '../../ldaccess/LDDict';
import { IKvStore } from '../../ldaccess/ikvstore';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';
import { Component } from 'react';
import { gdsfpLD, initLDLocalState } from '../generic/generatorFns';
import { VisualKeysDict } from './visualDict';
import React from 'react';

const TXT_NO_VIDEO = "no video data";
const CSS_CLASS_NAME = "videodisplay";

let cfgType: string = LDDict.VideoObject;
export const VIDEO_SHOW_CONTROLS = "showControls";
export const VIDEO_IS_MUTED = "muted";
export const VIDEO_IS_AUTOPLAYING = "autoplay";

let cfgIntrprtKeys: string[] =
	[LDDict.name, LDDict.fileFormat, LDDict.contentUrl, VIDEO_SHOW_CONTROLS, VIDEO_IS_MUTED, VIDEO_IS_AUTOPLAYING, VisualKeysDict.cssClassName];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: "metaexplorer.io/videoDisplay",
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureVideoDisplay extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: LDLocalState): null | LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [],
			[LDDict.name, LDDict.fileFormat, LDDict.contentUrl,
				VIDEO_SHOW_CONTROLS, VIDEO_IS_MUTED, VIDEO_IS_AUTOPLAYING,
			VisualKeysDict.cssClassName], cfgType);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, };
		return { ...rvNew };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	consumeLDOptions: (ldOptions: ILDOptions) => any;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = initLDLocalState(this.cfg, props, [],
			[LDDict.name, LDDict.fileFormat, LDDict.contentUrl,
				VIDEO_SHOW_CONTROLS, VIDEO_IS_MUTED, VIDEO_IS_AUTOPLAYING,
			VisualKeysDict.cssClassName]);
	}

	render() {
		const { ldOptions } = this.props;
		const { localValues } = this.state;
		let isShowVideoControls = localValues.get(VIDEO_SHOW_CONTROLS);
		isShowVideoControls = isShowVideoControls ? isShowVideoControls : false;
		let isMuted = localValues.get(VIDEO_IS_MUTED);
		let isAutoPlay = localValues.get(VIDEO_IS_AUTOPLAYING);
		let cssClassName = localValues.get(VisualKeysDict.cssClassName);
		cssClassName = cssClassName ? cssClassName : "";
		let videoLink: string = localValues.get(LDDict.contentUrl);
		if (!ldOptions) return <div>{TXT_NO_VIDEO}</div>;
		return <div className={`${CSS_CLASS_NAME} ${cssClassName}`}>
			<video src={videoLink} className="is-loading"
				autoPlay={isAutoPlay}
				muted={isMuted}
				controls={isShowVideoControls}
				onLoad={
					(ev) => {
						ev.currentTarget.classList.remove("is-loading");
					}
				}>
			</video>
		</div>;
	}
}
