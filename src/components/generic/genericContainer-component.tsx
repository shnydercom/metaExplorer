//TODO: continue implementing here, then put it into BaseDataTypePortSelector, then we can also build generic nodes that can set basic data types!
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import appIntMatcher from 'appconfig/appInterpreterMatcher';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { IHypermediaContainer } from 'hydraclient.js/src/DataModel/IHypermediaContainer';
import { singleHyperMediaToKvStores, multiHyperMediaToKvStores } from 'ldaccess/converterFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { IHypermedia } from 'hydraclient.js/src/DataModel/IHypermedia';
import { LDConsts } from 'ldaccess/LDConsts';
import { isInterpreter } from 'ldaccess/ldUtils';
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from 'appstate/epicducks/ldOptions-duck';

export type LDOwnProps = {
	ldTokenString: string;
};

type OwnProps = {
	searchCrudSkills: string;
} & LDOwnProps;

export type LDConnectedState = {
	ldOptions: ILDOptions
};

export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): LDConnectedState => {
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
			let kvStores: IKvStore[] = [{ key: undefined, value: undefined, ldType: null /*ownProps.displayedType*/ }];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});

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
class PureGenericContainer extends React.Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	constructor(props?: any) {
		super(props);
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

	componentWillReceiveProps(nextProps: OwnProps & LDConnectedDispatch, nextContext): void {
		console.log("willRecProps");
		console.log(nextProps);
		//	if (nextProps.displayedType !== this.props.displayedType) {
		//nextProps.notifyLDOptionsChange(null);
		//	}
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
		demoTypeParsed = this.consumeLDOptions(this.props.ldOptions); //displayedTypeLDOptions);
		//}
		return <div key={0}>
			genContainer Render
			{demoTypeParsed}
		</div>;
	}

	private kvsToComponent(input: IKvStore[]): any {
		let reactCompClasses: (React.ComponentClass<LDOwnProps>)[] = [];
		input.forEach((itm) => {
			let intrprtr = itm.intrprtrClass;
			if (isInterpreter(intrprtr)) {
				reactCompClasses.push(intrprtr as React.ComponentClass<LDOwnProps>);
			}
		});
		let reactComps = reactCompClasses.map((itm, idx) => {
			let GenericComp = itm;
			let ldTokenString: string = null;
			if (input.length === 1) {
				//genericComp is only a wrapper then, hand token down directly
				ldTokenString = this.props.ldTokenString;
			}
			return <GenericComp key={idx} ldTokenString={ldTokenString} />;
		});
		return <div>GenericContainerContents (kvsToComponent):{reactComps}</div>;
	}
}

export const GenericContainer = connect<LDConnectedState, LDConnectedDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(PureGenericContainer);
