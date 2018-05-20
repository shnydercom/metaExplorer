import { connect } from "react-redux";
import ldBlueprint, { BlueprintConfig, IBlueprintItpt, OutputKVMap } from "ldaccess/ldBlueprint";
import { UserDefDict } from "ldaccess/UserDefDict";
import { IKvStore } from "ldaccess/ikvstore";
import { ILDOptions } from "ldaccess/ildoptions";
import { ExplorerState } from "appstate/store";
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { RefMapTypeDesintegrator } from "components/generic/depr_RefMapTypeDesintegrator";
import ImgHeadSubDescIntrprtr from "components/visualcomposition/ImgHeadSubDescIntrprtr";
import { PureImgDisplay } from "components/imagedisplay-component";
import { BaseContainer } from "components/generic/baseContainer-component";
import { isReactComponent } from "components/reactUtils/reactUtilFns";
import { compNeedsUpdate } from "components/reactUtils/compUtilFns";
import { ObjectPropertyRef } from "ldaccess/ObjectPropertyRef";
import { ILDResource } from "ldaccess/ildresource";
import { ILDToken, NetworkPreferredToken, createConcatNetworkPreferredToken } from "ldaccess/ildtoken";
import { isObjPropertyRef } from "ldaccess/ldUtils";
import { LDConsts } from "ldaccess/LDConsts";
import { DEFAULT_ITPT_RETRIEVER_NAME } from "defaults/DefaultInterpreterRetriever";
import { Component } from "react";

export type OwnProps = LDOwnProps & {
	searchCrudSkills: string;
};

let canInterpretType: string = UserDefDict.intrprtrBPCfgRefMapType;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: canInterpretType,
	nameSelf: UserDefDict.intrprtrBPCfgRefMapName,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};
//TODO: move state-relevant ldOptionsMap-Entry generation outside of the component, or make this a non-visual interpreter
@ldBlueprint(bpCfg)
/**
 * @deprecated replaced by RefMapItpt-component and state-side handling
 */
export class PureRefMapIntrprtr extends Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	subOutputKVMap: { [s: string]: OutputKVMap };
	rmtd: RefMapTypeDesintegrator;
	initialKvStores: IKvStore[];
	subCfg: BlueprintConfig;
	constructor(props?: any) {
		super(props);
		let compBPCfg: BlueprintConfig = this.constructor["cfg"];
		this.subCfg = compBPCfg;
		this.rmtd = new RefMapTypeDesintegrator();
		this.rmtd.setRefMapBP(compBPCfg);
		let ldTS: string = this.props.ldTokenString;
		if (ldTS && ldTS !== "" && ldTS.length > 0) {
			this.subOutputKVMap = this.rmtd.fillSubOutputKVmaps(ldTS);
			this.fillLDOptions();
			//this.consumeLDOptions(this.props.ldOptions);
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		if (!ldOptions.resource || !ldOptions.resource.kvStores || ldOptions.resource.kvStores.length === 0) return;
		let kvs = ldOptions.resource.kvStores;
		this.subCfg.interpretableKeys.forEach((singleIntrpblKey) => {
			kvs.forEach((val, idx) => {
				if (val.ldType === this.subCfg.nameSelf) return;
				if (val.value == null) return;
				let ldTokenRef: ILDToken;
				let newLDResource: ILDResource;
				if (isObjPropertyRef(singleIntrpblKey)) {
					let lObjRef = (singleIntrpblKey as ObjectPropertyRef).objRef;
					if (lObjRef !== this.rmtd.extIntReferenceMap.get(lObjRef)) {
						ldTokenRef = new NetworkPreferredToken(this.rmtd.extIntReferenceMap.get(lObjRef));
					} else {
						ldTokenRef = createConcatNetworkPreferredToken(this.props.ldTokenString, lObjRef);
					}
					let ldPropRef = (singleIntrpblKey as ObjectPropertyRef).propRef;
					let ldValue = val.value[ldPropRef];
					newLDResource = {
						webInResource: null,
						webOutResource: null,
						kvStores: [{ key: ldPropRef, value: ldValue, ldType: null }]
					};
				} else if (val.ldType === UserDefDict.ldTokenStringReference) {
					//i.e. handing the reference down to the component
					newLDResource = {
						webInResource: null,
						webOutResource: null,
						kvStores: [val]
					};
					ldTokenRef = createConcatNetworkPreferredToken(this.props.ldTokenString, this.rmtd.headItptLnk);
				} else {
					console.error("unsupported ldType for reference");
				}
				let newLDOptions: ILDOptions = {
					isLoading: false,
					lang: null,
					ldToken: ldTokenRef,
					resource: newLDResource,
					visualInfo: {
						retriever: DEFAULT_ITPT_RETRIEVER_NAME
					}
				};
				this.props.notifyLDOptionsChange(newLDOptions);
			});
		});
	}

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		console.log("refMapProps: " + nextProps.ldTokenString);
		if (compNeedsUpdate(nextProps, this.props)) {
			this.subOutputKVMap = this.rmtd.fillSubOutputKVmaps(nextProps.ldTokenString);
			this.fillLDOptions();
			this.consumeLDOptions(nextProps.ldOptions);
		}
	}

	componentWillMount() {
		console.log("componentWillmount");
		console.log(this.constructor.name);
		console.log(this.constructor["cfg"]);
	}

	buildIntrprtrJSX(): any {
		let reactComps = [];
		let baseIntrprtr = this.rmtd.interpreterMap[this.rmtd.headItptLnk];
		let soKVM = this.subOutputKVMap;
		let BaseComp = baseIntrprtr;
		if (BaseComp === null || BaseComp === undefined) {
			console.error("InterpreterReferenceMapType-component: interpreter null or undefined");
		}
		let headToken = createConcatNetworkPreferredToken(this.props.ldTokenString, this.rmtd.refMapName + this.rmtd.headItptLnk);
		const { routes } = this.props;
		console.log("headToken: " + headToken.get());
		reactComps.push(<BaseComp key={0} routes={routes} ldTokenString={headToken.get()} />);
		/*for (let intrprtrKey in this.rmtd.interpreterMap) {
			if (this.rmtd.interpreterMap.hasOwnProperty(intrprtrKey)) {
				if (intrprtrKey === this.rmtd.headItptLnk) continue;
				let GenericComp = this.rmtd.interpreterMap[intrprtrKey];
				if (!isReactComponent(GenericComp)) continue;
				let kvMap = soKVM[intrprtrKey];
				let compLDToken = this.rmtd.createConcatNetworkPreferredToken(this.props.ldTokenString, intrprtrKey);
				reactComps.push(<GenericComp key={intrprtrKey} ldTokenString={compLDToken.get()} outputKVMap={kvMap} />);
			}
		}*/
		return <>{reactComps}</>;
	}

	render() {
		let subInterpreters = this.buildIntrprtrJSX();
		return <>
			{subInterpreters}
		</>;
	}

	private fillLDOptions() {
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
