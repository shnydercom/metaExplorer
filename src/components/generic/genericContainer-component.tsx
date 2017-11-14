//TODO: continue implementing here, then put it into BaseDataTypePortSelector, then we can also build generic nodes that can set basic data types!
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import appIntMatcher from 'appconfig/appInterpreterMatcher';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';
import { IHypermediaContainer } from 'hydraclient.js/src/DataModel/IHypermediaContainer';
import { singleHyperMediaToKvStores, multiHyperMediaToKvStores } from 'ldaccess/converterFns';
import { IWebResource } from 'hydraclient.js/src/DataModel/IWebResource';
import { IHypermedia } from 'hydraclient.js/src/DataModel/IHypermedia';
import { LDConsts } from 'ldaccess/LDConsts';
import { isInterpreter } from 'ldaccess/ldUtils';

type OwnProps = {
	//demoType is being used for empty display in the designer,
	//and represents a convenience function to show interpreters for types without having the necessary data
	displayedType: string;
	searchCrudSkills: string;
};
type ConnectedState = {
};

type ConnectedDispatch = {
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
});

let cfgType: string = LDDict.WrapperObject;
let cfgIntrprtTypes: string[] =
	[];
let initialKVStores: IKvStore[] = [];
let bpCfg: BlueprintConfig = {
	forType: cfgType,
	nameSelf: "shnyder/genericContainer",
	interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	getInterpretableKeys() { return cfgIntrprtTypes; },
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
class PureGenericContainer extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	initialKvStores: IKvStore[];
	constructor(props?: any) {
		super(props);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		let genKvStores: IKvStore[] = [];
		let sCSkills: string = "cRud";
		let hmArray: IHypermediaContainer = ldOptions.resource.hypermedia;
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
		genKvStores = appIntMatcher.matchKvArray(genKvStores, sCSkills);
		return this.kvsToComponent(genKvStores);
	}
	render() {
		var demoTypeParsed = null;
		if (this.props.displayedType) {
			let dType: string = this.props.displayedType;
			var demoWebResource: IWebResource = {
				hypermedia: [{ [LDConsts.type]: dType, members: null, client: null } as IHypermedia] as IHypermediaContainer,
			};
			var demoTypeLDOptions: ILDOptions = {
				lang: null,
				resource: demoWebResource,
				ldToken: null
			};
			demoTypeParsed = this.consumeLDOptions(demoTypeLDOptions);
		}
		return <div key={0}>
			{demoTypeParsed}
		</div>;
	}

	private kvsToComponent(input: IKvStore[]): any {
		let reactCompClasses: React.ComponentClass[] = [];
		input.forEach((itm) => {
			let intrprtr = itm.intrprtrClass;
			if (isInterpreter(intrprtr)) {
				reactCompClasses.push(intrprtr as React.ComponentClass);
			}
		});
		let reactComps = reactCompClasses.map((itm, idx) => {
			let GenericComp = itm;
			return <GenericComp key={idx}/>;

		});
		return <div>tessst{reactComps}</div>;
	}
}

export let GenericContainer =  connect<ConnectedState, ConnectedDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(PureGenericContainer);
