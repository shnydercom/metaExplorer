import { connect } from "react-redux";
import * as redux from 'redux';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from "ldaccess/ldBlueprint";
import * as React from "react";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ldOptionsClientSideUpdateAction, ldOptionsClientSideCreateAction } from "appstate/epicducks/ldOptions-duck";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";

/*export type LDOwnProps = {
	ldTokenString: string;
};*/

type OwnProps = {
	searchCrudSkills: string;
} & LDOwnProps;

/*export type LDConnectedState = {
	ldOptions: ILDOptions
};

export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};*/

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): LDConnectedState => {
	let tokenString: string = ownProps ? ownProps.ldTokenString : null;
	let ldOptionsLoc: ILDOptions = tokenString ? state.ldoptionsMap[tokenString] : null;
	return {
		ldOptions: ldOptionsLoc
	};
};

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: OwnProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let kvStores: IKvStore[] = [{ key: undefined, value: undefined, ldType: null /*ownProps.displayedType*/ /*}];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});*/

let canInterpretType: string = UserDefDict.intrprtrBPCfgRefMapType;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subInterpreterOf: null,
	canInterpretType: canInterpretType,
	nameSelf: UserDefDict.intrprtrBPCfgRefMapName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
class PureRefMapIntrprtr extends React.Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	constructor(props?: any) {
		super(props);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
	}

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch, nextContext): void {
		console.log("willRecProps");
		console.log(nextProps);
		//	if (nextProps.displayedType !== this.props.displayedType) {
		//nextProps.notifyLDOptionsChange(null);
		//	}
	}

	componentWillMount() {
		console.log("componentWillmount");
		//console.log(this.props);
		console.log(this.constructor.name);
		console.log(this.constructor["cfg"]);
		//console.log(bpCfg);
	}

	render() {
		return <div key={0}>
			refMapIntrprtr Render
		</div>;
	}
}

export const RefMapIntrprtr = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureRefMapIntrprtr);
