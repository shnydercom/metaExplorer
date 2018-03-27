//TODO: continue implementing here, then put it into BaseDataTypePortSelector, then we can also build generic nodes that can set basic data types!
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions, DEFAULT_INTERPRETER_RETRIEVER } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import appIntMatcher from 'appconfig/appInterpreterMatcher';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { IHypermediaContainer } from 'hydraclient.js/src/DataModel/IHypermediaContainer';
import { singleHyperMediaToKvStores, multiHyperMediaToKvStores } from 'ldaccess/converterFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
//import { IHypermedia } from 'hydraclient.js/src/DataModel/IHypermedia';
import { LDConsts } from 'ldaccess/LDConsts';
import { isInterpreter, isLDOptionsSame } from 'ldaccess/ldUtils';
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from 'appstate/epicducks/ldOptions-duck';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDRouteProps } from 'appstate/LDProps';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { ILDResource } from 'ldaccess/ildresource';
import { ILDToken, NetworkPreferredToken } from 'ldaccess/ildtoken';
import { UserDefDict } from 'ldaccess/UserDefDict';

/*export type LDOwnProps = {
	ldTokenString: string;
};*/

export interface GenOwnProps extends LDOwnProps {
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

let cfgType: string = LDDict.WrapperObject;
let cfgIntrprtKeys: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	subInterpreterOf: null,
	canInterpretType: cfgType,
	nameSelf: "shnyder/genericContainer",
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
export class PureGenericContainer extends React.Component<LDConnectedState & LDConnectedDispatch & GenOwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];
	isGenericChanged: boolean = false;
	genCompCache: any;
	constructor(props?: any) {
		super(props);
		this.isGenericChanged = true;
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		if (!ldOptions) return;
		let genKvStores: IKvStore[] = [];
		if (ldOptions.resource) {
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
			genKvStores = appIntMatcher.matchKvArray(genKvStores, sCSkills);
		}
		return genKvStores ? this.kvsToComponent(genKvStores) : null;
	}

	componentWillReceiveProps(nextProps: GenOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.isGenericChanged = true;
		}
	}

	componentWillMount() {
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}

	render() {
		var demoTypeParsed = null;
		//if (this.props.displayedType) {
		let dType: string = null; // this.props.displayedType;
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
		if (this.isGenericChanged) {
			this.genCompCache = this.consumeLDOptions(this.props.ldOptions); //displayedTypeLDOptions);
			this.isGenericChanged = false;
		}
		//}
		return <>
			{this.genCompCache ? this.genCompCache : null}
		</>;
	}

	private kvsToComponent(input: IKvStore[]): any {
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
			let newldOptions: ILDOptions = { ldToken: ldToken, resource: ldRes, isLoading: false, lang: "en",
			visualInfo: {
				retriever: DEFAULT_INTERPRETER_RETRIEVER
			} };
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
	}
}

export const GenericContainer = connect<LDConnectedState, LDConnectedDispatch, GenOwnProps>(mapStateToProps, mapDispatchToProps)(PureGenericContainer);
