//TODO: continue implementing here, then put it into BaseDataTypePortSelector, then we can also build generic nodes that can set basic data types!
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { appItptMatcherFn } from 'appconfig/appInterpreterMatcher';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { IHypermediaContainer } from 'hydraclient.js/src/DataModel/IHypermediaContainer';
import { singleHyperMediaToKvStores, multiHyperMediaToKvStores } from 'ldaccess/converterFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
//import { IHypermedia } from 'hydraclient.js/src/DataModel/IHypermedia';
import { LDConsts } from 'ldaccess/LDConsts';
import { isInterpreter, isLDOptionsSame, ldOptionsDeepCopy } from 'ldaccess/ldUtils';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { ILDResource } from 'ldaccess/ildresource';
import { ILDToken, NetworkPreferredToken, linearLDTokenStr } from 'ldaccess/ildtoken';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { DEFAULT_ITPT_RETRIEVER_NAME } from 'defaults/DefaultInterpreterRetriever';
import { isReactComponent } from '../reactUtils/reactUtilFns';
import { LDError } from 'appstate/LDError';

/*export type LDOwnProps = {
	ldTokenString: string;
};*/

export interface BaseContOwnProps extends LDOwnProps {
	searchCrudSkills: string;
}

/*export type LDConnectedState = {
	ldOptions: ILDOptions
};

export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};*/
/*
const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>, ownProps: OwnProps): LDConnectedDispatch => ({
	notifyLDOptionsChange: (ldOptions: ILDOptions) => {
		if (!ownProps.ldTokenString) return;
		if (!ldOptions) {
			let kvStores: IKvStore[] = [{ key: undefined, value: undefined, ldType: null /*ownProps.displayedType*/

/*}];
let lang: string;
let alias: string = ownProps.ldTokenString;
dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
} else {
dispatch(ldOptionsClientSideUpdateAction({... ldOptions}));
}
}
});*/

export const COMP_BASE_CONTAINER = "shnyder/baseContainer";

let cfgType: string = UserDefDict.itptContainerObjType;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subItptOf: null,
	canInterpretType: cfgType,
	nameSelf: COMP_BASE_CONTAINER,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureBaseContainer extends React.Component<LDConnectedState & LDConnectedDispatch & BaseContOwnProps, {}>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	outputKVMap: OutputKVMap;
	reactCompInfo: {
		compClass: React.ComponentClass<LDOwnProps>,
		compOutputKvMap: OutputKVMap
	}[] = [];
	//genCompCache: any;
	//isWrapper: boolean = false;
	constructor(props?: any) {
		super(props);
		this.cfg = this.constructor["cfg"];
		if (props) {
			this.consumeLDOptions(props.ldOptions);
		}
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		let genKvStores: IKvStore[] = [];
		let ldTokenString = ldOptions.ldToken.get();
		let retriever: string = ldOptions.visualInfo.retriever;
		let interpretedBy = ldOptions.visualInfo.interpretedBy;
		let sCSkills: string = "cRud";
		this.reactCompInfo = [];
		if (ldOptions.isLoading) return;
		if (!interpretedBy || !isLDOptionsSame(this.props.ldOptions, ldOptions)) {
			//i.e. first time this ldOptions-Object gets interpreted, or interpreter-change
			let newldOptions = ldOptionsDeepCopy(ldOptions);
			newldOptions.visualInfo.interpretedBy = this.cfg.nameSelf;
			this.props.notifyLDOptionsLinearSplitChange(newldOptions);
			return;
		} else {
			ldOptions.resource.kvStores.forEach((elem, idx) => {
				let elemKey: string = elem.key;
				let itpt = appItptMatcherFn().getItptRetriever(retriever).getDerivedItpt(linearLDTokenStr(ldTokenString, idx));
				if (isReactComponent(itpt)) {
					let targetLDToken: ILDToken = new NetworkPreferredToken(this.props.ldTokenString);
					let newOutputKvMap: OutputKVMap = { [elemKey]: { targetLDToken: targetLDToken, targetProperty: elemKey } };
					this.reactCompInfo.push({ compClass: itpt, compOutputKvMap: newOutputKvMap });
				} else {
					throw new LDError("baseContainer got a non-visual component");
				}
			});
		}
		//appIntMatcher.matchLDOptions(ldOptions, sCSkills, "default");
		/*if (ldOptions.resource) {
			let sCSkills: string = "cRud";
			if (ldOptions.resource.kvStores) {
				genKvStores = ldOptions.resource.kvStores;
			} else if (ldOptions.resource.webInResource) {
				let hmArray: IHypermediaContainer = ldOptions.resource.webInResource.hypermedia;
				if (hmArray.length === 0) return;
				if (hmArray.length === 1) {
					genKvStores = singleHyperMediaToKvStores(hmArray[0]);
				}
				if (hmArray.length > 1) {
					genKvStores = multiHyperMediaToKvStores(hmArray);
				}
				if (this.props.searchCrudSkills) {
					sCSkills = this.props.searchCrudSkills;
				}
			}
			//TODO: filter for UserDefDict.intrprtrNameKey and UserDefDict.intrptrtType first, ignore other keys if interpreter is found
			genKvStores = appIntMatcher.matchLDOptions(ldOptions, genKvStores, sCSkills, "default");
		}
		this.genCompCache = genKvStores ? this.kvsToComponent(genKvStores) : null;*/
	}

	componentWillReceiveProps(nextProps: BaseContOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		//if (compNeedsUpdate(nextProps, this.props)) {
		this.consumeLDOptions(nextProps.ldOptions);
		//}
	}

	componentWillMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	render() {
		let { ldTokenString, routes } = this.props;
		let reactComps = this.reactCompInfo.map((itm, idx) => {
			let GenericComp = itm.compClass;
			return <GenericComp key={idx} routes={routes} ldTokenString={
				linearLDTokenStr(ldTokenString, idx)
			} outputKVMap={itm.compOutputKvMap} />;
		});
		return <>
			{reactComps ? reactComps : null}
		</>;
		//var demoTypeParsed = null;
		//if (this.props.displayedType) {
		//let dType: string = null; // this.props.displayedType;
		/*var demoWebResource: IWebResource = {
			hypermedia: [{ [LDConsts.type]: dType, members: null, client: null } as IHypermedia] as IHypermediaContainer,
		};*/
		/*var displayedTypeLDOptions: ILDOptions = this.props.ldOptions ? this.props.ldOptions : {
			lang: null,
			resource: {
				kvStores: [{ key: undefined, value: undefined, ldType:  dType }],
				webInResource: null,
				webOutResource: null
			},
			ldToken: null,
			isLoading: false
		};*/
		/*if (this.isContainerChanged) {
			this.genCompCache = this.consumeLDOptions(this.props.ldOptions); //displayedTypeLDOptions);
			this.isContainerChanged = false;
		}*/
		//}
	}

	/*private kvsToComponent(input: IKvStore[]): any {
		let reactCompClasses: (React.ComponentClass<LDOwnProps>)[] = [];
		let intrprtrNames: string[] = [];
		input.forEach((itm) => {
			let intrprtr = itm.intrprtrClass;
			if (isInterpreter(intrprtr)) {
				reactCompClasses.push(intrprtr as React.ComponentClass<LDOwnProps>);
			}
		});
		let reactComps = reactCompClasses.map((itm, idx) => {
			let GenericComp = itm;
			let ldTokenString: string = null;
			let tokenStringExtension = input[idx].key ? input[idx].key : "-gen-" + idx;
			ldTokenString = this.props.ldTokenString + tokenStringExtension;
			//
			let ldRes: ILDResource = { webInResource: null, webOutResource: null, kvStores: [input[idx]] };
			let ldToken: ILDToken = new NetworkPreferredToken(ldTokenString);
			let newldOptions: ILDOptions = {
				ldToken: ldToken, resource: ldRes, isLoading: false, lang: "en",
				visualInfo: {
					retriever: DEFAULT_ITPT_RETRIEVER_NAME
				}
			};
			this.props.notifyLDOptionsChange(newldOptions);
			const { routes } = this.props;
			return <GenericComp key={idx} routes={routes} ldTokenString={ldTokenString} outputKVMap={null} />;
		});
		if (reactComps.length === 1) {
			//genericComp is only a wrapper then, hand token down directly
			let searchIdx = reactComps[0].key;
			let GenericSingle = reactCompClasses[searchIdx];
			const { routes } = this.props;
			reactComps[0] = <GenericSingle key={0} routes={routes} ldTokenString={this.props.ldTokenString} outputKVMap={null} />;
		}
		return <>{reactComps}</>;
	}*/
}

export const BaseContainer = connect<LDConnectedState, LDConnectedDispatch, BaseContOwnProps>(mapStateToProps, mapDispatchToProps)(PureBaseContainer);
