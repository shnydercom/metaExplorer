import * as React from "react";
import * as redux from 'redux';
import { PortWidget, DefaultPortModel } from "storm-react-diagrams";
import { SinglePortWidget } from "components/appinterpreter-parts/SinglePortWidget";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { BaseDataTypeDropDown } from "components/basedatatypeinterpreter/BaseDataTypeDropDown";
import { GenericContainer } from "components/generic/genericContainer-component";
import { IKvStore } from "ldaccess/ikvstore";
import { ExplorerState } from "appstate/store";
import { ILDOptions } from "ldaccess/ildoptions";
import { connect } from "react-redux";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";

/*export type LDOwnProps = {
	ldTokenString: string;
};*/

export type BaseDataTypePortSelectorProps = {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
} & LDOwnProps;

export interface BaseDataTypePortSelectorState {
	portType: string;
}

/*const mapStateToProps = (state: ExplorerState, ownProps: BaseDataTypePortSelectorProps): LDConnectedState & BaseDataTypePortSelectorProps => {
	let tokenString: string = ownProps && ownProps.model ? ownProps.model.getID() : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		...ownProps,
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: BaseDataTypePortSelectorProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let kvStores: IKvStore[] = [ownProps.model.kv];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});*/

class PureBaseDataTypePortSelector extends React.Component<BaseDataTypePortSelectorProps & LDConnectedState & LDConnectedDispatch, BaseDataTypePortSelectorState> {
	public static defaultProps: BaseDataTypePortSelectorProps = {
		in: true,
		label: "port",
		ldTokenString: null,
		outputKVMap: null
	};

	constructor(props) {
		super(props);
		this.state = {
			portType: null,
			ldOptions: null
		};
	}

	componentWillReceiveProps(nextProps, nextContext): void {
		if (nextProps.ldOptions) nextProps.model.kv = nextProps.ldOptions.resource.kvStores[0];
	}

	onPortTypeChange = (newType: string) => {
		this.setState({ portType: newType });
		let changedKvStore: IKvStore = this.props.model.kv;
		changedKvStore.ldType = newType;
		changedKvStore.key = null;
		changedKvStore.value = null;
		changedKvStore.intrprtrClass = null;
		this.props.notifyLDOptionsChange(this.props.ldOptions);
	}

	render() {
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div className={"out-port top-port"}>
				<div>
					{label}
					<BaseDataTypeDropDown selectionChange={(newType) => { this.onPortTypeChange(newType); }} />
					<GenericContainer ldTokenString={this.props.model.id} searchCrudSkills="CrUd" outputKVMap={null}/>
				</div>
				{port}
			</div>
		);
	}
}

export const BaseDataTypePortSelector = connect<LDConnectedState, LDConnectedDispatch, BaseDataTypePortSelectorProps>(mapStateToProps, mapDispatchToProps)(PureBaseDataTypePortSelector);
