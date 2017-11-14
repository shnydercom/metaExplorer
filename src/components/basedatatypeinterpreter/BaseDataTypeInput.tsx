import assertNever from "assert-never";
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import {Input, InputTheme} from 'react-toolbox';
import {Switch, SwitchTheme} from 'react-toolbox';
import {DatePicker, DatePickerTheme} from 'react-toolbox';
import {TimePicker, TimePickerTheme} from 'react-toolbox';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintInterpreter } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';

import { LDBaseDataType } from 'ldaccess/LDBaseDataType';

/**
 * @author Jonathan Schneider
 * for each Base Data Type an interpreter is being configured, the React-Part
 * of the interpreter is the same for all Base Data Types
 */

type OwnProps = {
	singleKV: IKvStore;
};
type ConnectedState = {
};

type ConnectedDispatch = {
	//fileChange: (fileList: FileList, url: string) => void;
};

const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): ConnectedState => ({
});

const mapDispatchToProps = (dispatch: redux.Dispatch<ExplorerState>): ConnectedDispatch => ({
	/*fileChange: (fileList: FileList, url: string) => {
			dispatch(uploadImgRequestAction(fileList, url));
			return;
	}*/
});

let bdts: LDBaseDataType[] = [LDDict.Boolean, LDDict.Integer, LDDict.Double, LDDict.Text, LDDict.Date, LDDict.DateTime];
let bpcfgs: BlueprintConfig[] = new Array();

for (var bdt in bdts) {
	if (bdts.hasOwnProperty(bdt)) {
		var elem = bdts[bdt];
		//let cfgType: string = LDDict.CreateAction;
		let cfgIntrprtTypes: string[] = [];
		let initialKVStores: IKvStore[] = [
			{
				key: undefined,
				value: undefined,
				ldType: elem
			}];
		let bpCfg: BlueprintConfig = {
			//consumeWebResource: (ldOptions: ILDOptions) => { return; },
			forType: elem,
			nameSelf: "shnyder/react-toolbox/" + elem,
			interpreterRetrieverFn: appIntprtrRetr,
			initialKvStores: initialKVStores,
			getInterpretableKeys() { return cfgIntrprtTypes; },
			crudSkills: "CRUd"
		};
		bpcfgs.push(bpCfg);
	}
}

class PureBaseDataTypeInput extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, {}>
	implements IBlueprintInterpreter {
	cfg: BlueprintConfig;

	initialKvStores: IKvStore[];

	state = {
		singleKV: null
	};
	constructor(props: any) {
		super(props);
		this.render = () => null;
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	handleChange = (evtval) => {
		console.log("a change event: ");
		console.dir(evtval);
		let modSingleKV: IKvStore = this.state.singleKV;
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKV: modSingleKV });
		//this.setState({...this.state, [name]: value});
	}

	componentWillMount() {
		this.state.singleKV = this.initialKvStores[0]; //TODO: check, if this can be done with the setState fn. Only needed for determineRenderFn
		//this.setState({ ...this.state, singleKV: this.initialKvStores[0]});
		let baseDT: LDBaseDataType = this.state.singleKV.ldType as LDBaseDataType;
		this.determineRenderFn(baseDT);
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
var BoolInput = ldBlueprint(bpcfgs[0])(PureBaseDataTypeInput);
var IntInput = ldBlueprint(bpcfgs[1])(PureBaseDataTypeInput);
var DoubleInput = ldBlueprint(bpcfgs[2])(PureBaseDataTypeInput);
var TextInput = ldBlueprint(bpcfgs[3])(PureBaseDataTypeInput);
var DateInput = ldBlueprint(bpcfgs[4])(PureBaseDataTypeInput);
var DateTimeInput = ldBlueprint(bpcfgs[5])(PureBaseDataTypeInput);

export let BooleanValInput = connect(mapStateToProps, mapDispatchToProps)(BoolInput);
export let IntegerValInput = connect(mapStateToProps, mapDispatchToProps)(IntInput);
export let DoubleValInput = connect(mapStateToProps, mapDispatchToProps)(DoubleInput);
export let TextValInput = connect(mapStateToProps, mapDispatchToProps)(TextInput);
export let DateValInput = connect(mapStateToProps, mapDispatchToProps)(DateInput);
export let DateTimeValInput = connect(mapStateToProps, mapDispatchToProps)(DateTimeInput);
