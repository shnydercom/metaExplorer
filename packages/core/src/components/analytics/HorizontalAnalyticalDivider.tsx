import React, { Component, useEffect, useRef } from "react";
import { ldBlueprint, BlueprintConfig } from "../../ldaccess/ldBlueprint";
import {
	KVL,
	LDDict,
	UserDefDict,
	IBlueprintItpt,
	OutputKVMap,
	ILDOptions,
} from "../../ldaccess";
import { VisualKeysDict } from "../visualcomposition";
import { ActionKeysDict, ActionType, ActionTypesDict } from "../actions";
import useIntersectionObserver from "./intersector-hook";
import {
	LDConnectedDispatch,
	LDConnectedState,
	LDLocalState,
	LDOwnProps,
} from "../../appstate";
import { gdsfpLD, initLDLocalState } from "../generic";

interface DividerHRProps {
	elementId?: string;
	className?: string;
	onVisibilityChanged?: (visible: boolean) => void;
}

const DividerHR = (props?: DividerHRProps) => {
	const hrRef = useRef<HTMLHRElement | null>(null);
	const [isVisible /*entry*/] = useIntersectionObserver({
		elementRef: hrRef,
	});

	useEffect(
		() => props.onVisibilityChanged && props.onVisibilityChanged(isVisible),
		[isVisible, !!props.onVisibilityChanged]
	);

	const compProps = {};
	if(props) {
		if(props.className) compProps["className"] = props.className;
		if(props.elementId) compProps["id"] = props.elementId;
	}
	return <hr ref={hrRef} {...compProps} />;
};

let cfgIntrprtKeys: string[] = [
	VisualKeysDict.elementId,
	VisualKeysDict.cssClassName,
	ActionKeysDict.action_visibility_change,
];
let ownKVLs: KVL[] = [
	{
		key: VisualKeysDict.elementId,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualKeysDict.cssClassName,
		value: undefined,
		ldType: LDDict.Text,
	},
	{
		key: ActionKeysDict.action_visibility_change,
		value: undefined,
		ldType: ActionTypesDict.metaExplorerAction,
	},
];

export const ANALYTICS_HR_NAME =
	"metaexplorer.io/analytics/HRVisibilityDetector";

const hrBpCfg: BlueprintConfig = {
	subItptOf: null,
	nameSelf: ANALYTICS_HR_NAME,
	ownKVLs: ownKVLs,
	inKeys: cfgIntrprtKeys,
	crudSkills: "cRud",
	canInterpretType:
		ANALYTICS_HR_NAME + UserDefDict.standardItptObjectTypeSuffix,
};

export const HR_IFRAME_CFG = { ...hrBpCfg };

export interface HRState extends LDLocalState {}

@ldBlueprint(HR_IFRAME_CFG)
export class PureHRAnalyticsComponent
	extends Component<
		LDConnectedState & LDConnectedDispatch & LDOwnProps,
		HRState
	>
	implements IBlueprintItpt {
	static getDerivedStateFromProps(
		nextProps: LDConnectedState & LDConnectedDispatch & LDOwnProps,
		prevState: HRState
	): null | HRState {
		let rvLD = gdsfpLD(
			nextProps,
			prevState,
			[],
			cfgIntrprtKeys,
			null,
			[],
			[true]
		);
		if (!rvLD) {
			return null;
		}
		let rvNew = { ...rvLD };
		return {
			...rvNew,
		};
	}

	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	ownKVLs: KVL[];

	constructor(props: any) {
		super(props);
		this.cfg = this.constructor["cfg"] as BlueprintConfig;
		const ldState = initLDLocalState(
			this.cfg,
			props,
			[],
			cfgIntrprtKeys,
			[],
			[true]
		);
		this.state = {
			...ldState,
		};
	}

	onTrigger = (isVisible: boolean) => {
		let visibilityAction: ActionType = this.state.localValues.get(
			ActionKeysDict.action_visibility_change
		);
		if (visibilityAction) {
			if (
				Array.isArray(visibilityAction.payload) &&
				visibilityAction.payload.length === 1
			) {
				visibilityAction.payload = isVisible; // visibilityAction.payload[0];
			}
			this.props.dispatchLdAction(
				visibilityAction.ldId,
				visibilityAction.ldType,
				visibilityAction.payload
			);
		}
	};

	render() {
		const { localValues } = this.state;
		const cssClassName = localValues.get(VisualKeysDict.cssClassName);
		const elementId = localValues.get(VisualKeysDict.elementId);
		return <DividerHR elementId={elementId} className={cssClassName}></DividerHR>;
	}
}
