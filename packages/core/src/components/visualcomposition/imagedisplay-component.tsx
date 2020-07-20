import { LDDict } from '../../ldaccess/LDDict';
import { KVL } from '../../ldaccess/KVL';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../../ldaccess/ldBlueprint';
import { ILDOptions } from '../../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../../appstate/LDProps';
import { Component } from 'react';
import { gdsfpLD, initLDLocalState } from '../generic/generatorFns';
import { VisualKeysDict } from './visualDict';
import React from 'react';

let cfgType: string = LDDict.ImageObject;
export const CSS_OBJECT_FIT = "CSSObjectFit";
let cfgIntrprtKeys: string[] =
	[LDDict.name, LDDict.fileFormat, LDDict.contentUrl, CSS_OBJECT_FIT, VisualKeysDict.cssClassName];
let ownKVLs: KVL[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: "metaexplorer.io/imageDisplay",
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureImgDisplay extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, LDLocalState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: LDLocalState): null | LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [], [LDDict.name, LDDict.fileFormat, LDDict.contentUrl, CSS_OBJECT_FIT, VisualKeysDict.cssClassName], cfgType);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD, };
		return { ...rvNew };
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	ownKVLs: KVL[];
	consumeLDOptions: (ldOptions: ILDOptions) => any;

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		this.state = initLDLocalState(this.cfg, props, [], [LDDict.name, LDDict.fileFormat, LDDict.contentUrl, CSS_OBJECT_FIT, VisualKeysDict.cssClassName]);
	}

	render() {
		const { ldOptions } = this.props;
		const { localValues } = this.state;
		let objFit = localValues.get(CSS_OBJECT_FIT);
		objFit = objFit ? objFit : "unset";
		let cssClassName = localValues.get(VisualKeysDict.cssClassName);
		cssClassName = cssClassName ? cssClassName : "";
		let imgLnk: string = localValues.get(LDDict.contentUrl);
		if (!ldOptions) return <div>no Image data</div>;
		return <div className={"imgdisplay " + cssClassName}>
			<img alt="" src={imgLnk} className="is-loading"
				onLoad={
					(ev) => {
						ev.currentTarget.classList.remove("is-loading");
					}
				}
				style={{ objectFit: objFit }} />
		</div>;
	}
}
