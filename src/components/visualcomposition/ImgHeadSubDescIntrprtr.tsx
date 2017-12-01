import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ExplorerState } from 'appstate/store';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';

type OwnProps = {
	test: string;
};
type ConnectedState = {
	test: string;
};

type ConnectedDispatch = {
	test: string;
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
	test: ""
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
	test: ""
});

export var ImgHeadSubDescIntrprtrName: string = "shnyder/ImgHeadSubDescIntrprtr";
let cfgType: string = ImgHeadSubDescIntrprtrName;
let cfgIntrprtKeys: string[] =
	[VisualDict.headerImgDisplay, VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description, VisualDict.footerIntrprtr];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.headerImgDisplay,
		value: undefined,
		ldType: LDDict.ImageObject
	},
	{
		key: VisualDict.headerTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.subHeaderTxt,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.description,
		value: undefined,
		ldType: LDDict.Text
	},
	{
		key: VisualDict.footerIntrprtr,
		value: undefined,
		ldType: UserDefDict.intrptrtType
	}
];
let bpCfg: BlueprintConfig = {
	forType: cfgType,
	nameSelf: ImgHeadSubDescIntrprtrName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	getInterpretableKeys() { return cfgIntrprtKeys; },
	crudSkills: "cRud"
};

interface TestState {
	myState: string;
}
@ldBlueprint(bpCfg)
class PureImgHeadSubDesc extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
	}
	render() {
		return <div>
			ImgHeadSubDescIntrprtr working
		</div>;
	}
}

export default connect<ConnectedState, ConnectedDispatch, OwnProps>(mapStateToProps, mapDispatchToProps)(PureImgHeadSubDesc);
