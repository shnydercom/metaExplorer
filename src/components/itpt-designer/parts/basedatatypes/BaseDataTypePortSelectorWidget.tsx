import { SinglePortWidget } from "./../SinglePortWidget";
import { LDPortModel } from "./../LDPortModel";
import { BaseDataTypeDropDown } from "./BaseDataTypeDropDown";
import { IKvStore } from "ldaccess/ikvstore";
import { connect } from "react-redux";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDLocalState } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { Component, ComponentClass, StatelessComponent } from "react";
import { OutputKVMap } from "ldaccess/ldBlueprint";
import { ILDToken, NetworkPreferredToken } from "ldaccess/ildtoken";
import { UserDefDict } from "ldaccess/UserDefDict";
import { compNeedsUpdate } from "components/reactUtils/compUtilFns";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { BaseContainerRewrite } from "../../../generic/baseContainer-rewrite";
import { getDerivedKVStateFromProps } from "../../../generic/generatorFns";
import { ILDOptions } from "ldaccess/ildoptions";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultItptRetriever";
import { LDDict } from "ldaccess/LDDict";

export type BaseDataTypePortSelectorProps = {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
} & LDOwnProps;

export interface BaseDataTypePortSelectorState {
	portType: string;
	portKvStore: IKvStore | null;
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
			if (nextProps.model.kv) {
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
							nextProps.model.kv
						]
					}
				};
				nextProps.notifyLDOptionsChange(ldOptsWModel);
				return {
					compInfos: null,
					localLDTypes: newLDTypes,
					localValues: newLDValues,
					portKvStore: nextProps.model.kv,
					portType: nextProps.model.kv.ldType
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
		let rvLocal = getDerivedKVStateFromProps(
			nextProps, prevState, [UserDefDict.singleKvStore]);
		let newKV = nextProps.ldOptions && nextProps.ldOptions.resource && nextProps.ldOptions.resource.kvStores
			? getKVStoreByKey(nextProps.ldOptions.resource.kvStores, UserDefDict.singleKvStore) : null;
		newKV = newKV ? newKV : { key: UserDefDict.singleKvStore, value: null, ldType: null };
		nextProps.model.kv = newKV;
		let newType = newKV ? newKV.ldType : null;
		if (!rvLocal) {
			return { ...prevState, portKvStore: newKV, portType: newType };
		} else {
			if (!nextProps.ldOptions) return null;
			let newLDOptions = ldOptionsDeepCopy(nextProps.ldOptions);
			newLDOptions.resource.kvStores = [newKV];
			nextProps.notifyLDOptionsChange(newLDOptions);
		}
		return { ...prevState, ...rvLocal, portKvStore: newKV, portType: newType };
	}

	/*componentWillReceiveProps(nextProps, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			let newKV: IKvStore = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, UserDefDict.singleKvStore);
			newKV = newKV ? newKV : { key: null, value: null, ldType: null };
			nextProps.model.kv = newKV;
			let newType = newKV ? newKV.ldType : null;
			this.onPortTypeChange(newType, nextProps);
		}
	}*/

	constructor(props) {
		super(props);
		this.state = {
			portType: null,
			ldOptions: null,
			portKvStore: null,
			compInfos: null,
			localValues: null,
			localLDTypes: null
		};
		// this.props.notifyLDOptionsChange(null);
	}

	onPortTypeChange = (newType: string, nProps: BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch) => {
		let changedKvStore: IKvStore = this.props.model.kv;
		if (newType !== changedKvStore.ldType) {
			changedKvStore.ldType = newType;
			changedKvStore.key = UserDefDict.singleKvStore;
			changedKvStore.value = null;
		}
		this.setState({ ...this.state, portType: newType, portKvStore: changedKvStore });
		let newLDOptions = ldOptionsDeepCopy(nProps.ldOptions);
		newLDOptions.resource.kvStores = [changedKvStore];
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	render() {
		const { portType } = this.state;
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;
		let targetID = this.props.model.id;
		let newToken: ILDToken = new NetworkPreferredToken(targetID);
		let newOutputKVMap: OutputKVMap = { [targetID]: { targetLDToken: newToken, targetProperty: null } };
		return (
			<div className={"out-port top-port"}>
				<div onFocus={() => this.props.model.getParent().setSelected(false)}>
					{label}
					<BaseDataTypeDropDown selection={portType as LDDict.Boolean |
						LDDict.Integer |
						LDDict.Double |
						LDDict.Text |
						LDDict.Date |
						LDDict.DateTime}
						selectionChange={(newType) => { this.onPortTypeChange(newType, this.props); }} />
					{portType ? <BaseContainerRewrite ldTokenString={targetID} searchCrudSkills="CrUd" routes={null} /> : null}
				</div>
				{port}
			</div>
		);
	}
}

export const BaseDataTypePortSelector = connect<LDConnectedState, LDConnectedDispatch, BaseDataTypePortSelectorProps>
	(mapStateToProps, mapDispatchToProps)(PureBaseDataTypePortSelector);
