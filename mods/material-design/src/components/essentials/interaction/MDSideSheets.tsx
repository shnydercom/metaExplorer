import React from 'react';
import {
	LDDict, KVL, ldBlueprint, BlueprintConfig, IBlueprintItpt, OutputKVMap,
	ILDOptions, VisualKeysDict, LDOwnProps,
	LDConnectedDispatch, LDConnectedState, LDLocalState,
	gdsfpLD, initLDLocalState, ActionKeysDict, ActionType, generateItptFromCompInfo,
	LDUIDictVerbs, ActionTypesDict, LDUIDict, UserDefDict, NetworkPreferredToken,
} from '@metaexplorer/core';
import { Component } from 'react';
import { Drawer } from '@material-ui/core';

export const MDSideSheetName: string = "metaexplorer.io/material-design/SideSheet";
const cfgItptInputKeys: string[] = [
	VisualKeysDict.primaryItpt,
];
let cfgRegularInputKeys: string[] = [
	LDUIDictVerbs.isOpen,
	ActionKeysDict.action_confirm,
	LDUIDictVerbs.anchor,
];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.primaryItpt,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
	},
	{
		key: LDUIDictVerbs.isOpen,
		value: undefined,
		ldType: LDDict.Boolean
	},
	{
		key: ActionKeysDict.action_confirm,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction
	},
	{
		key: LDUIDictVerbs.anchor,
		value: undefined,
		ldType: undefined // TODO: one of LDUIDict.Top/Right/Bottom/Left
	},
	//output
	{
		key: UserDefDict.outputData,
		value: undefined,
		ldType: LDDict.Boolean
	},
];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: MDSideSheetName,
	ownKVLs: ownKVLs,
	inKeys: [...cfgItptInputKeys, ...cfgRegularInputKeys],
	crudSkills: "cRud"
};

export type MDSideSheetState = {
	isOpen: boolean;
};

@ldBlueprint(bpCfg)
export class PureMDSideSheet extends
	Component<
	LDConnectedState & LDConnectedDispatch & LDOwnProps,
	LDLocalState & MDSideSheetState
	> implements IBlueprintItpt {

	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: null | MDSideSheetState & LDLocalState)
		: null | MDSideSheetState & LDLocalState {
		let rvLD = gdsfpLD(
			nextProps, prevState, [...cfgItptInputKeys], [...cfgRegularInputKeys, UserDefDict.outputKVMapKey]);
		if (!rvLD) {
			return null;
		}
		const isOpen = rvLD.localValues.get(LDUIDictVerbs.isOpen);
		return {
			...prevState,
			isOpen,
			...rvLD
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	protected renderSub = generateItptFromCompInfo.bind(this);

	constructor(props: any) {
		super(props);
		this.cfg = (this.constructor["cfg"] as BlueprintConfig);
		const sideSheetStatePart: MDSideSheetState = {
			isOpen: false
		};
		this.state = {
			...sideSheetStatePart,
			...initLDLocalState(this.cfg, props,
				[...cfgItptInputKeys],
				[...cfgRegularInputKeys, UserDefDict.outputKVMapKey])
		};
	}

	render() {
		const { localValues, compInfos, isOpen } = this.state;
		const hasPrimaryContent = compInfos.has(VisualKeysDict.primaryItpt);
		const anchorLD = localValues.get(LDUIDictVerbs.anchor);
		//allow shorthand values
		let anchor = (["top", "right", "bottom", "left"].find((val) => val === anchorLD));
		anchor = anchor ? anchor : "left";
		switch (anchorLD) {
			case LDUIDict.Top:
				anchor = "top";
				break;
			case LDUIDict.Right:
				anchor = "right";
				break;
			case LDUIDict.Bottom:
				anchor = "bottom";
				break;
			case LDUIDict.Left:
				anchor = "left";
				break;
			default:
				break;
		}
		return this.renderSideSheet(isOpen, hasPrimaryContent, anchor);
	}

	setIsDrawerOpen = (isOpen: boolean) => {
		this.setState({
			...this.state,
			isOpen
		}, () => {
			const closeAction: ActionType = this.state.localValues.get(ActionKeysDict.action_close);
			const outputKVMap: OutputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
			const isOpenOutputKey = UserDefDict.outputData;
			if (!outputKVMap || !outputKVMap[isOpenOutputKey]) return;
			if (outputKVMap[isOpenOutputKey].findIndex((val) => (
				val.targetLDToken.getClientTokenVal() === this.props.ldTokenString
				&& val.targetProperty === LDUIDictVerbs.isOpen
			)) === -1) {
				outputKVMap[isOpenOutputKey].push({
					targetLDToken: new NetworkPreferredToken(this.props.ldTokenString),
					targetProperty: LDUIDictVerbs.isOpen
				});
			}
			this.props.dispatchKvOutput([{
				key: isOpenOutputKey,
				value: isOpen,
				ldType: undefined
			}], this.props.ldTokenString, outputKVMap);
			if (closeAction) {
				this.props.dispatchLdAction(closeAction.ldId, closeAction.ldType, closeAction.payload);
			}
		}
		);
	}

	/**
	 * in a separate render function to eventually turn it into an abstract component
	 */
	protected renderSideSheet(isOpen?: boolean, hasPrimaryContent?: boolean, anchor?) {
		this.renderSub(VisualKeysDict.primaryItpt);
		return <Drawer anchor={anchor ? anchor : 'left'} open={!!isOpen} onClose={() => this.setIsDrawerOpen(false)} >
			{hasPrimaryContent && this.renderSub(VisualKeysDict.primaryItpt)}
		</Drawer>;
	}

}
