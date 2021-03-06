import { SinglePortWidget } from "../edgesettings/SinglePortWidget";
import { LDPortModel } from "../_super/LDPortModel";
import { BaseDataTypeDropDown } from "./BaseDataTypeDropDown";
import {
	KVL, LDOwnProps, LDConnectedState, LDConnectedDispatch, LDLocalState, mapStateToProps, mapDispatchToProps,
	OutputKVMapElement, ldOptionsDeepCopy, UserDefDict, ILDToken, NetworkPreferredToken, getKVStoreByKey,
	ILDOptions, DEFAULT_ITPT_RETRIEVER_NAME, LDDict, gdsfpLD, BaseContainerRewrite
} from "@metaexplorer/core";
import { connect } from "react-redux";
import { Component } from "react";
import React from "react";

export type BaseDataTypePortSelectorProps = {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
} & LDOwnProps;

export interface BaseDataTypePortSelectorState {
	portType: string;
	portKvStore: KVL | null;
}

class PureBaseDataTypePortSelector extends Component<BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch, BaseDataTypePortSelectorState & LDLocalState> {

	public static defaultProps: BaseDataTypePortSelectorProps = {
		in: true,
		label: "port",
		ldTokenString: null
	};

	static getDerivedStateFromProps(
		nextProps: BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch,
		prevState: null | LDLocalState & BaseDataTypePortSelectorState)
		: null | LDLocalState & BaseDataTypePortSelectorState {
		if (!prevState.compInfos && !prevState.localLDTypes && !prevState.localValues && !prevState.portKvStore && !prevState.portType) {
			let newLDTypes = new Map<string, any>();
			let newLDValues = new Map<string, any>();
			if (nextProps.model.getKV()) {
				let newLDTk: ILDToken = new NetworkPreferredToken(nextProps.ldTokenString);
				let ldOptsWModel: ILDOptions = {
					isLoading: false,
					lang: null,
					ldToken: newLDTk,
					visualInfo: { retriever: DEFAULT_ITPT_RETRIEVER_NAME },
					resource: {
						webInResource: null,
						webOutResource: null,
						kvStores: [
							nextProps.model.getKV()
						]
					}
				};
				nextProps.notifyLDOptionsChange(ldOptsWModel);
				return {
					compInfos: null,
					localLDTypes: newLDTypes,
					localValues: newLDValues,
					portKvStore: nextProps.model.getKV(),
					portType: nextProps.model.getKV().ldType
				};
			}
			nextProps.notifyLDOptionsChange(null);
			return {
				compInfos: null,
				localLDTypes: newLDTypes,
				localValues: newLDValues,
				portKvStore: null,
				portType: null
			};
		}
		let rvLD = gdsfpLD(
			nextProps, prevState, [], [UserDefDict.outputData]);
		let newKV = nextProps.ldOptions && nextProps.ldOptions.resource && nextProps.ldOptions.resource.kvStores
			? getKVStoreByKey(nextProps.ldOptions.resource.kvStores, UserDefDict.outputData) : null;
		newKV = newKV ? newKV : prevState.portKvStore ? prevState.portKvStore : { key: UserDefDict.outputData, value: null, ldType: null };
		nextProps.model.setKV(newKV);
		let newType = newKV ? newKV.ldType : null;
		if (!rvLD) {
			return { ...prevState, portKvStore: newKV, portType: newType };
		} else {
			if (!nextProps.ldOptions) return null;
			let newLDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			let thisInput: OutputKVMapElement = {
				targetLDToken: new NetworkPreferredToken(nextProps.ldOptions.ldToken.get()),
				targetProperty: UserDefDict.outputData
			};
			let outputKvMap: KVL = {
				key: UserDefDict.outputKVMapKey,
				ldType: UserDefDict.outputKVMapType,
				value: {
					[UserDefDict.outputData]: [
						thisInput
					]
				}
			};
			newLDOptions.resource.kvStores = [newKV, outputKvMap];
			nextProps.notifyLDOptionsChange(newLDOptions);
			if ((newKV.value !== prevState.portKvStore.value) && nextProps.model) {
				const links = nextProps.model.getLinks();
				if (links && Object.keys(links).length > 0) {
					const linksKeys = Object.keys(links);
					const nextPort: LDPortModel = nextProps.model.clone();
					nextPort.setKV(newKV);
					// { ...nextProps.model, kv: newKV };
					links[linksKeys[0]].fireEvent(
						{
							port: nextPort as LDPortModel
						},
						'sourcePortChanged'
					);
				}
			}
		}
		return { ...prevState, ...rvLD, portKvStore: newKV, portType: newType };
	}

	constructor(props) {
		super(props);
		this.state = {
			portType: null,
			//ldOptions: null,
			portKvStore: null,
			compInfos: null,
			localValues: null,
			localLDTypes: null
		};
		// this.props.notifyLDOptionsChange(null);
	}

	componentDidUpdate() {
		if (this.props.ldOptions && !this.state.portType) {
			this.onPortTypeChange(LDDict.Boolean, this.props);
		}
	}

	onPortTypeChange = (newType: string, nProps: BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch) => {
		let changedKvStore: KVL = this.props.model.getKV();
		let thisInput: OutputKVMapElement = {
			targetLDToken: new NetworkPreferredToken(nProps.ldOptions.ldToken.get()),
			targetProperty: UserDefDict.outputData
		};
		let outputKvMap: KVL = {
			key: UserDefDict.outputKVMapKey,
			ldType: UserDefDict.outputKVMapType,
			value: {
				[UserDefDict.outputData]: [
					thisInput
				]
			}
		};
		const outputKv: KVL = {
			key: UserDefDict.outputData,
			value: null,
			ldType: newType
		};
		if (newType !== changedKvStore.ldType) {
			changedKvStore.ldType = newType;
			changedKvStore.key = UserDefDict.outputData;
			changedKvStore.value = null;
		}
		this.setState({ ...this.state, portType: newType, portKvStore: outputKv });
		let newLDOptions = ldOptionsDeepCopy(nProps.ldOptions);
		newLDOptions.resource.kvStores = [changedKvStore, outputKvMap];
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	render() {
		const { portType } = this.state;
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.getName()} isMulti={true} />;
		var label = <div className="name">{this.props.model.getLabel()}</div>;
		let targetID = this.props.model.getID();
		//let newToken: ILDToken = new NetworkPreferredToken(targetID);
		//let newOutputKVMap: OutputKVMap = { [targetID]: { targetLDToken: newToken, targetProperty: null } };
		return (
			<div className={"out-port top-port"}>
				<div className="input-highlight" onFocus={() => this.props.model.getParent().setSelected(false)}>
					{label}
					<BaseDataTypeDropDown className="input-highlight" selection={portType as LDDict.Boolean |
						LDDict.Integer |
						LDDict.Double |
						LDDict.Text |
						LDDict.Date |
						LDDict.DateTime}
						selectionChange={(newType) => { this.onPortTypeChange(newType, this.props); }} />
					<div className="editor-selectbdt-inputcontainer">
						{portType ? <BaseContainerRewrite ldTokenString={targetID} routes={null} /> : null}
					</div>
				</div>
				{port}
			</div>
		);
	}
}

export const BaseDataTypePortSelector = connect<LDConnectedState, LDConnectedDispatch, BaseDataTypePortSelectorProps>
	(mapStateToProps, mapDispatchToProps)(PureBaseDataTypePortSelector);
