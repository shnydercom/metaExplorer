import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { ExplorerState } from 'appstate/store';
import { LDDict } from 'ldaccess/LDDict';
import { IKvStore } from 'ldaccess/ikvstore';
import ldBlueprint, { BlueprintConfig, IBlueprintInterpreter, OutputKVMap } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';
import { VisualDict } from 'components/visualcomposition/visualDict';
import { UserDefDict } from 'ldaccess/UserDefDict';
import { mapStateToProps, mapDispatchToProps } from 'appstate/reduxFns';
import { LDOwnProps, LDConnectedDispatch, LDConnectedState } from 'appstate/LDProps';
import { compNeedsUpdate } from 'components/reactUtils/compUtilFns';
import { elementAt } from 'rxjs/operators/elementAt';
import { generateIntrprtrForProp } from 'components/generic/generatorFns';

type OwnProps = {
	test: string;
};
type ConnectedState = {
	test: string;
};

type ConnectedDispatch = {
	test: string;
};

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
	test: ""
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
	test: ""
});*/

export var ImgHeadSubDescIntrprtrName: string = "shnyder/ImgHeadSubDescIntrprtr";
let cfgType: string = ImgHeadSubDescIntrprtrName;
let cfgIntrprtKeys: string[] =
	[VisualDict.headerImgDisplay, VisualDict.headerTxt, VisualDict.subHeaderTxt, VisualDict.description, VisualDict.footerIntrprtr];
let initialKVStores: IKvStore[] = [
	{
		key: VisualDict.headerImgDisplay,
		value: undefined,
		ldType: UserDefDict.intrprtrClassType
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
		ldType: UserDefDict.intrprtrClassType
	}
];
let bpCfg: BlueprintConfig = {
	subInterpreterOf: null,
	nameSelf: ImgHeadSubDescIntrprtrName,
	//interpreterRetrieverFn: appIntprtrRetr,
	initialKvStores: initialKVStores,
	interpretableKeys: cfgIntrprtKeys,
	crudSkills: "cRud"
};

interface TestState {
	myState: string;
}
@ldBlueprint(bpCfg)
export class PureImgHeadSubDesc extends React.Component<LDConnectedState & LDConnectedDispatch & LDOwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	headerImgDisplay: any;
	consumeLDOptions: (ldOptions: ILDOptions) => any;
	initialKvStores: IKvStore[];
	constructor(props: any) {
		super(props);
		console.log(this.constructor["cfg"]);
		if (props) this.handleKVs(props);
	}
	componentWillReceiveProps(nextProps: LDOwnProps & LDConnectedDispatch & LDConnectedState, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}
	render() {
		return <div>
			ImgHeadSubDescIntrprtr working
			headerImg:
			{this.headerImgDisplay}
			children:
			{this.props.children}
		</div>;
	}
	private handleKVs(props: LDOwnProps & LDConnectedState) {
		let kvs: IKvStore[];
		if (props && props.ldOptions && props.ldOptions.resource && props.ldOptions.resource.kvStores) {
			kvs = props.ldOptions.resource.kvStores;
			this.headerImgDisplay = generateIntrprtrForProp(kvs, VisualDict.headerImgDisplay);
		}
		if (!this.headerImgDisplay) {
			kvs = (this.constructor["cfg"] as BlueprintConfig).initialKvStores;
			this.headerImgDisplay = generateIntrprtrForProp(kvs, VisualDict.headerImgDisplay);
		}
	}
}

export default connect<LDConnectedState, LDConnectedDispatch, LDOwnProps>(mapStateToProps, mapDispatchToProps)(PureImgHeadSubDesc);
