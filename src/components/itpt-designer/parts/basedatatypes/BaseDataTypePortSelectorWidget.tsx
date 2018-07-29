import { PortWidget, DefaultPortModel } from "storm-react-diagrams";
import { SinglePortWidget } from "./../SinglePortWidget";
import { LDPortModel } from "./../LDPortModel";
import { BaseDataTypeDropDown } from "./BaseDataTypeDropDown";
import { IKvStore } from "ldaccess/ikvstore";
import { ExplorerState } from "appstate/store";
import { ILDOptions } from "ldaccess/ildoptions";
import { connect } from "react-redux";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { BaseContainer } from "components/generic/baseContainer-component";
import { Component, ComponentClass, StatelessComponent } from "react";
import { OutputKVMap } from "ldaccess/ldBlueprint";
import { ILDToken, NetworkPreferredToken } from "ldaccess/ildtoken";
import { UserDefDict } from "ldaccess/UserDefDict";
import { compNeedsUpdate } from "components/reactUtils/compUtilFns";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { LDDict } from "ldaccess/LDDict";
import { BaseContainerRewrite } from "../../../generic/baseContainer-rewrite";

export type BaseDataTypePortSelectorProps = {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
} & LDOwnProps;

export interface BaseDataTypePortSelectorState {
	portType: string;
}

class PureBaseDataTypePortSelector extends Component<BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch, BaseDataTypePortSelectorState> {
	public static defaultProps: BaseDataTypePortSelectorProps = {
		in: true,
		label: "port",
		ldTokenString: null
	};

	constructor(props) {
		super(props);
		this.state = {
			portType: null,
			ldOptions: null
		};
		this.props.notifyLDOptionsChange(null);
	}

	componentWillReceiveProps(nextProps, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			let newKV: IKvStore = getKVStoreByKey(nextProps.ldOptions.resource.kvStores, UserDefDict.singleKvStore);
			newKV = newKV ? newKV : { key: null, value: null, ldType: null };
			nextProps.model.kv = newKV;
			let newType = newKV ? newKV.ldType : null;
			this.onPortTypeChange(newType, nextProps);
		}
	}

	onPortTypeChange = (newType: string, nProps: BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch) => {
		this.setState({ portType: newType });
		let changedKvStore: IKvStore = this.props.model.kv;
		if (newType !== changedKvStore.ldType) {
			changedKvStore.ldType = newType;
			changedKvStore.key = UserDefDict.singleKvStore;
			changedKvStore.value = null;
		}
		let newLDOptions = ldOptionsDeepCopy(nProps.ldOptions);
		newLDOptions.resource.kvStores = [changedKvStore];
		this.props.notifyLDOptionsChange(newLDOptions);
	}

	render() {
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;
		let targetID = this.props.model.id;
		let newToken: ILDToken = new NetworkPreferredToken(targetID);
		let newOutputKVMap: OutputKVMap = { [targetID]: { targetLDToken: newToken, targetProperty: null } };
		return (
			<div className={"out-port top-port"}>
				<div onFocus={() => this.props.model.getParent().setSelected(false)}>
					{label}
					<BaseDataTypeDropDown selectionChange={(newType) => { this.onPortTypeChange(newType, this.props); }} />
					{this.state.portType ? <BaseContainerRewrite ldTokenString={targetID} searchCrudSkills="CrUd" routes={null} /> : null}
				</div>
				{port}
			</div>
		);
	}
}

export const BaseDataTypePortSelector = connect<LDConnectedState, LDConnectedDispatch, BaseDataTypePortSelectorProps>
	(mapStateToProps, mapDispatchToProps)(PureBaseDataTypePortSelector);
