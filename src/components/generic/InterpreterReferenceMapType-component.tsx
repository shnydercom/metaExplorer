import { connect } from "react-redux";
import * as redux from 'redux';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from "ldaccess/ldBlueprint";
import * as React from "react";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ldOptionsClientSideUpdateAction, ldOptionsClientSideCreateAction } from "appstate/epicducks/ldOptions-duck";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { RefMapTypeDesintegrator } from "components/generic/RefMapTypeDesintegrator";
import ImgHeadSubDescIntrprtr from "components/visualcomposition/ImgHeadSubDescIntrprtr";
import { PureImgDisplay } from "components/imagedisplay-component";
import { GenericContainer } from "components/generic/genericContainer-component";
import { isReactComponent } from "components/reactUtils/reactUtilFns";
import { compNeedsUpdate } from "components/reactUtils/compUtilFns";

export type OwnProps = {
	searchCrudSkills: string;
} & LDOwnProps;

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
export class PureRefMapIntrprtr extends React.Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	subOutputKVMap: { [s: string]: OutputKVMap };
	rmtd: RefMapTypeDesintegrator;
	initialKvStores: IKvStore[];
	constructor(props?: any) {
		super(props);
		let compBPCfg: BlueprintConfig = this.constructor["cfg"];
		this.rmtd = new RefMapTypeDesintegrator();
		this.rmtd.setRefMapBP(compBPCfg);
		let ldTS: string = this.props.ldTokenString;
		if (ldTS && ldTS !== "" && ldTS.length > 0) {
			this.subOutputKVMap = this.rmtd.fillSubOutputKVmaps(ldTS);
			this.fillLDOptions();
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
	}

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.subOutputKVMap = this.rmtd.fillSubOutputKVmaps(nextProps.ldTokenString);
			this.fillLDOptions();
		}
	}

	componentWillMount() {
		console.log("componentWillmount");
		console.log(this.constructor.name);
		console.log(this.constructor["cfg"]);
	}

	buildIntrprtrJSX(): any {
		let reactComps = [];
		let baseIntrprtr = this.rmtd.interpreterMap[this.rmtd.headInterpreterLnk];
		let soKVM = this.subOutputKVMap;
		let BaseComp = baseIntrprtr;
		let headToken = this.rmtd.createConcatNetworkPreferredToken(this.props.ldTokenString, this.rmtd.headInterpreterLnk);
		reactComps.push(<BaseComp key={0} ldTokenString={headToken.get()} outputKVMap={null} />);
		/*for (let intrprtrKey in this.rmtd.interpreterMap) {
			if (this.rmtd.interpreterMap.hasOwnProperty(intrprtrKey)) {
				if (intrprtrKey === this.rmtd.headInterpreterLnk) continue;
				let GenericComp = this.rmtd.interpreterMap[intrprtrKey];
				if (!isReactComponent(GenericComp)) continue;
				let kvMap = soKVM[intrprtrKey];
				let compLDToken = this.rmtd.createConcatNetworkPreferredToken(this.props.ldTokenString, intrprtrKey);
				reactComps.push(<GenericComp key={intrprtrKey} ldTokenString={compLDToken.get()} outputKVMap={kvMap} />);
			}
		}*/
		return <div>{reactComps}</div>;
	}

	render() {
		let subInterpreters = this.buildIntrprtrJSX();
		return <div key={0}>
			RefMapIntrprtr working
			{subInterpreters}
		</div>;
	}

	private fillLDOptions(){
		let ldOptionsMap = this.rmtd.fillLDOptions(this.subOutputKVMap, this.props.ldTokenString);
		for (const ldOptKey in ldOptionsMap) {
			if (ldOptionsMap.hasOwnProperty(ldOptKey)) {
				const elem = ldOptionsMap[ldOptKey];
				this.props.notifyLDOptionsChange(elem);
			}
		}
	}
}

//export const RefMapIntrprtr = connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureRefMapIntrprtr);
