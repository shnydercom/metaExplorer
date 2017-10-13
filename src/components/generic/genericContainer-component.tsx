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

type OwnProps = {
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
	interpreterRetriever: appIntprtrRetr,
	initialKvStores: initialKVStores,
	getInterpretableKeys() { return cfgIntrprtTypes; },
	crudSkills: "cRud"
};

@ldBlueprint(bpCfg)
class PureGenericContainer extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	initialKvStores: IKvStore[];
	constructor(props: OwnProps) {
		super(props);
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		let genKvStores: IKvStore[] = [];
		let hmArray: IHypermediaContainer = ldOptions.resource.hypermedia;
		if (hmArray.length === 0) return;
		if (hmArray.length === 1) {
			genKvStores = singleHyperMediaToKvStores(hmArray[0]);
		}
		if (hmArray.length > 1) {
			genKvStores = multiHyperMediaToKvStores(hmArray);
		}
		appIntMatcher.matchKvArray(genKvStores, "cRud");
	}
}

export let GenericContainer = connect(mapStateToProps, mapDispatchToProps)(PureGenericContainer);
