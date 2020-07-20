import { KVL } from '../ldaccess/KVL';
import { ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap } from '../ldaccess/ldBlueprint';
import { ILDOptions } from '../ldaccess/ildoptions';
import { LDConnectedState, LDConnectedDispatch, LDOwnProps, LDLocalState } from '../appstate/LDProps';
import { UserDefDict } from '../ldaccess/UserDefDict';

import { Component, Fragment } from 'react';
import { LDDict } from '../ldaccess/LDDict';
import { VisualKeysDict } from './visualcomposition/visualDict';
import { gdsfpLD, initLDLocalState, generateItptFromCompInfo } from './generic/generatorFns';
import React from 'react';

export const projCfgName = "ProjectConfiguration";

let cfgIntrprtKeys: string[] =
	[VisualKeysDict.inputContainer, UserDefDict.configItpt];

let inKeys: string[] = [...cfgIntrprtKeys, VisualKeysDict.cssClassName];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.inputContainer,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: UserDefDict.configItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text
	},

];

let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: projCfgName,
	ownKVLs: ownKVLs,
	inKeys: inKeys,
	crudSkills: "cRud"
};
export interface ProjectConfigState extends LDLocalState {
}

@ldBlueprint(bpCfg)
export class PureProjectConfig extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, ProjectConfigState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: ProjectConfigState): null | ProjectConfigState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [VisualKeysDict.inputContainer], [UserDefDict.configItpt, VisualKeysDict.cssClassName], null, [true]);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];
	styleClassName: string;

	protected renderInputContainer = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [VisualKeysDict.inputContainer],
			[UserDefDict.configItpt, VisualKeysDict.cssClassName]);
		this.state = {
			...ldState,
		};
	}
	render() {
		//let renderFreeResult: JSX.Element = this.renderInputContainer();
		let listSections = [];
		const sectionElems = this.state.compInfos.get(VisualKeysDict.inputContainer);
		const { routes } = this.props;
		if (Array.isArray(sectionElems)) {
			sectionElems.forEach((elem, displayIdx) => {
				listSections.push(this.renderInputContainer(VisualKeysDict.inputContainer, routes, displayIdx));
			}
			);
		} else {
			listSections.push(this.renderInputContainer(VisualKeysDict.inputContainer, routes));
		}
		if (!listSections || listSections.length === 0) return null;

		const cssClassName = this.state.localValues.get(VisualKeysDict.cssClassName);
		if (!!cssClassName) {
			return <div className={cssClassName}>{
				listSections.map((listSection, idx) => {
					if (!listSection) return null;
					return <Fragment key={"frag" + idx}>
						{listSection}
					</Fragment>;
				}
				)
			}</div>;
		}
		return <>{
			listSections.map((listSection, idx) => {
				if (!listSection) return null;
				return <Fragment key={"frag" + idx}>
					{listSection}
				</Fragment>;
			}
			)
		}</>;
	}
}
