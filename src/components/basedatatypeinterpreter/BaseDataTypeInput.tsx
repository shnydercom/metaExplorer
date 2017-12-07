import assertNever from "assert-never";
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { Input, InputTheme } from 'react-toolbox';
import { Switch, SwitchTheme } from 'react-toolbox';
import { DatePicker, DatePickerTheme } from 'react-toolbox';
import { TimePicker, TimePickerTheme } from 'react-toolbox';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';

import { LDBaseDataType } from 'ldaccess/LDBaseDataType';
import { LDConnectedState, LDOwnProps } from "components/generic/genericContainer-component";
import { ldOptionsClientSideCreateAction, ldOptionsClientSideUpdateAction } from "appstate/epicducks/ldOptions-duck";

/**
 * @author Jonathan Schneider
 * for each Base Data Type an interpreter is being configured, the React-Part
 * of the interpreter is the same for all Base Data Types
 */

type OwnProps = {
	singleKV: IKvStore;
} & LDOwnProps;
/*type ConnectedState = {
};

type ConnectedDispatch = {
	//fileChange: (fileList: FileList, url: string) => void;
};*/

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
		if (!ldOptions) {
			let kvStores: IKvStore[] = [ownProps.singleKV];
			let lang: string;
			let alias: string = ownProps.ldTokenString;
			dispatch(ldOptionsClientSideCreateAction(kvStores, lang, alias));
		} else {
			dispatch(ldOptionsClientSideUpdateAction(ldOptions));
		}
	}
});

let bdts: LDBaseDataType[] = [LDDict.Boolean, LDDict.Integer, LDDict.Double, LDDict.Text, LDDict.Date, LDDict.DateTime];
let bpcfgs: BlueprintConfig[] = new Array();

for (var bdt in bdts) {
	if (bdts.hasOwnProperty(bdt)) {
		var elem = bdts[bdt];
		//let cfgType: string = LDDict.CreateAction;
		let cfgIntrprtKeys: string[] = [];
		let initialKVStores: IKvStore[] = [
			{
				key: undefined,
				value: undefined,
				ldType: elem
			}];
		let bpCfg: BlueprintConfig = {
			forType: elem,
			nameSelf: "shnyder/react-toolbox/" + elem,
			//interpreterRetrieverFn: appIntprtrRetr,
			initialKvStores: initialKVStores,
			interpretableKeys: cfgIntrprtKeys,
			crudSkills: "CRUd"
		};
		bpcfgs.push(bpCfg);
	}
}
class PureBaseDataTypeInput extends React.Component<LDConnectedState & LDConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;

	initialKvStores: IKvStore[];

	state = {
		singleKV: null
	};
	constructor(props?: any) {
		super(props);
		this.render = () => null;
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	handleChange = (evtval) => {
		let modSingleKV: IKvStore = this.state.singleKV;
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKV: modSingleKV });
		//TODO: it might be a good idea to debounce before updating the application state
		this.props.ldOptions.resource.kvStores = [this.state.singleKV];
		this.props.notifyLDOptionsChange(this.props.ldOptions);
		//this.setState({...this.state, [name]: value});
	}

	componentWillMount() {
		this.state.singleKV = {...this.initialKvStores[0]}; //TODO: check, if this can be done with the setState fn. Only needed for determineRenderFn
		//this.setState({ ...this.state, singleKV: this.initialKvStores[0]});
		let baseDT: LDBaseDataType = this.state.singleKV.ldType as LDBaseDataType;
		this.determineRenderFn(baseDT);
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		}
	}
	parseDate: any = (input): Date => {
		return input ? input : new Date();
	}
	parseTime: any = (input): Date => {
		return input ? input : new Date();
	}
	private determineRenderFn = (baseDT: LDBaseDataType) => {
		switch (baseDT) {
			case LDDict.Boolean:
				this.render = () => <Switch checked={this.state.singleKV.value}
					label={this.state.singleKV.key}
					onChange={(evt) => this.handleChange(evt)} />;
				break;
			case LDDict.Integer:
				this.render = () => <Input type='number'
					label={this.state.singleKV.key}
					name={this.state.singleKV.key}
					value={this.state.singleKV.value}
					onChange={(evt) => this.handleChange(evt)} />;
				break;
			case LDDict.Double:
				this.render = () => <Input type='number'
					label={this.state.singleKV.key}
					name={this.state.singleKV.key}
					value={this.state.singleKV.value}
					onChange={(evt) => this.handleChange(evt)} />;
				break;
			case LDDict.Text:
				this.render = () => <Input type='text'
					label={this.state.singleKV.key}
					name={this.state.singleKV.key}
					value={this.state.singleKV.value}
					onChange={(evt) => this.handleChange(evt)} />;
				break;
			case LDDict.Date:
				this.render = () => {
					var parsedDate = this.parseDate(this.state.singleKV.value);
					return <DatePicker
						label={this.state.singleKV.key}
						onChange={(evt) => this.handleChange(evt)}
						value={parsedDate}
						sundayFirstDayOfWeek />;
				};
				break;
			case LDDict.DateTime:
				this.render = () => {
					var parsedDate = this.parseDate(this.state.singleKV.value);
					var parsedTime = this.parseTime(this.state.singleKV.value);
					return <div>
						<DatePicker
							label={this.state.singleKV.key}
							onChange={(evt) => this.handleChange(evt)}
							value={parsedDate}
							sundayFirstDayOfWeek />;
						<TimePicker
							label='Finishing time'
							onChange={this.handleChange}
							value={parsedTime}
						/></div>;
				};
				break;
			default:
				return assertNever(baseDT);
		}
	}
}

//this is the same as using a decorator function on individual classes
const BoolInput = ldBlueprint(bpcfgs[0])(PureBaseDataTypeInput);
const IntInput = ldBlueprint(bpcfgs[1])(PureBaseDataTypeInput);
const DoubleInput = ldBlueprint(bpcfgs[2])(PureBaseDataTypeInput);
const TextInput = ldBlueprint(bpcfgs[3])(PureBaseDataTypeInput);
const DateInput = ldBlueprint(bpcfgs[4])(PureBaseDataTypeInput);
const DateTimeInput = ldBlueprint(bpcfgs[5])(PureBaseDataTypeInput);

export const BooleanValInput = connect(mapStateToProps, mapDispatchToProps)(BoolInput);
export const IntegerValInput = connect(mapStateToProps, mapDispatchToProps)(IntInput);
export const DoubleValInput = connect(mapStateToProps, mapDispatchToProps)(DoubleInput);
export const TextValInput = connect(mapStateToProps, mapDispatchToProps)(TextInput);
export const DateValInput = connect(mapStateToProps, mapDispatchToProps)(DateInput);
export const DateTimeValInput = connect(mapStateToProps, mapDispatchToProps)(DateTimeInput);
