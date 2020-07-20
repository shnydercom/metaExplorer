import { LDConnectedDispatch, LDConnectedState, LDLocalState, LDOwnProps } from "../../../appstate";
import { BlueprintConfig, IBlueprintItpt, KVL, ILDOptions, LDDict, LDUIDict, OutputKVMap } from "../../../ldaccess";
import { Component, ReactNode } from "react";
import { gdsfpLD, initLDLocalState } from "../../generic";

let cfgType: string = LDDict.ChooseAction;
const singleValueSelectorInputKeys: string[] = [
	LDDict.description,
	LDDict.actionOption,
	LDDict.object];
const ownKVLs: KVL[] = [
	{
		key: LDDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: LDDict.actionOption,
		value: undefined,
		ldType: LDUIDict.NTuple
	},
	{
		key: LDDict.object,
		value: undefined,
		ldType: LDUIDict.OneTuple
	}
];

export const SingleValueSelectorBpCfg: BlueprintConfig = {
	subItptOf: undefined,
	canInterpretType: cfgType,
	nameSelf: "metaexplorer.io/core/SingleValueSelector",
	ownKVLs: ownKVLs,
	inKeys: singleValueSelectorInputKeys,
	crudSkills: "CRUd"
};

export type SingleValueSelectorState = LDLocalState;

export abstract class AbstractSingleValueSelector extends Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, SingleValueSelectorState>
	implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: SingleValueSelectorState): null | SingleValueSelectorState {
		let rvLocal = gdsfpLD(nextProps, prevState, [], singleValueSelectorInputKeys);
		if (!rvLocal) {
			return null;
		}
		let rvNew = { ...rvLocal };
		return { ...prevState, ...rvNew };
	}

	//member-declarations for the interface
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const ldState = initLDLocalState(this.cfg, props, [], singleValueSelectorInputKeys);
		this.state = { ...ldState };
	}

	render(): ReactNode {
		throw new Error("Method not implemented in abstract class");
	}
}
