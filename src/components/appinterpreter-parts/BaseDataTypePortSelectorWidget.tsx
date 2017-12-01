import * as React from "react";
import { PortWidget, DefaultPortModel } from "storm-react-diagrams";
import { SinglePortWidget } from "components/appinterpreter-parts/SinglePortWidget";
import { LDPortModel } from "components/appinterpreter-parts/LDPortModel";
import { BaseDataTypeDropDown } from "components/basedatatypeinterpreter/BaseDataTypeDropDown";
import { GenericContainer, LDConnectedState } from "components/generic/genericContainer-component";
import { IKvStore } from "ldaccess/ikvstore";
import { ExplorerState } from "appstate/store";
import { ILDOptions } from "ldaccess/ildoptions";
import { connect } from "react-redux";

export interface BaseDataTypePortSelectorProps {
	model?: LDPortModel;
	in?: boolean;
	label?: string;
}

export interface BaseDataTypePortSelectorState {
	portType: string;
}

const mapStateToProps = (state: ExplorerState, ownProps: BaseDataTypePortSelectorProps): LDConnectedState & BaseDataTypePortSelectorProps => {
	let tokenString: string = ownProps && ownProps.model ? ownProps.model.getID() : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	if (ldOptionsLoc) ownProps.model.kv = ldOptionsLoc.resource.kvStores[0];
	return {
		...ownProps,
		ldOptions: ldOptionsLoc
	};
};

class PureBaseDataTypePortSelector extends React.Component<BaseDataTypePortSelectorProps & LDConnectedState, BaseDataTypePortSelectorState> {
	public static defaultProps: BaseDataTypePortSelectorProps = {
		in: true,
		label: "port"
	};

	constructor(props) {
		super(props);
		this.state = {
			portType: null,
			ldOptions: null
		};
	}

	componentWillReceiveProps(nextProps, nextContext): void {
		console.log(nextProps);
	}

	onPortTypeChange = (newType: string) => {
		this.setState({ portType: newType });
		let changedKvStore: IKvStore = this.props.model.kv;
		changedKvStore.ldType = newType;
	}

	render() {
		var port = <SinglePortWidget node={this.props.model.getParent()} name={this.props.model.name} isMulti={true} />;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div className={"out-port top-port"}>
				<div>
					{label}
					<BaseDataTypeDropDown selectionChange={(newType) => { this.onPortTypeChange(newType); }} />
					<GenericContainer ldTokenString={this.props.model.id} displayedType={this.state.portType} searchCrudSkills="CrUd" />
				</div>
				{port}
			</div>
		);
	}
}

export const BaseDataTypePortSelector = connect<LDConnectedState, {}, BaseDataTypePortSelectorProps>(mapStateToProps)(PureBaseDataTypePortSelector);
