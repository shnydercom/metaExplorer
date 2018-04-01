import assertNever from "assert-never";
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import { Input, InputTheme } from 'react-toolbox';
import { Switch } from 'react-toolbox';
import { DatePicker, DatePickerTheme } from 'react-toolbox';
import { TimePicker, TimePickerTheme } from 'react-toolbox';

import { ExplorerState } from 'appstate/store';
import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

//import appIntprtrRetr from 'appconfig/appInterpreterRetriever';
import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';

import { LDBaseDataType } from 'ldaccess/LDBaseDataType';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";

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

/*export type LDConnectedDispatch = {
	notifyLDOptionsChange: (ldOptions: ILDOptions) => void;
};*/

/*const mapStateToProps = (state: ExplorerState, ownProps: OwnProps): LDConnectedState => {
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
});*/

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
			},
			{
				key: LDDict.description,
				value: undefined,
				ldType: LDDict.Text
			}
		];
		let bpCfg: BlueprintConfig = {
			subItptOf: undefined,
			canInterpretType: elem,
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
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];

	state = {
		singleKV: null
	};
	constructor(props?: LDConnectedState & LDConnectedDispatch & OwnProps) {
		super(props);
		//if (!props) {
		this.render = () => null;
		//}
		/* else {
				if (props.ldOptions && props.ldOptions.resource.kvStores.length > 0) {
					this.determineRenderFn(nextSingleKV.ldType);
				}
			}*/
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	componentWillReceiveProps(nextProps, nextContext): void {
		console.log("cWillRecProps")
		if (nextProps.ldOptions) {
			let nextSingleKV = nextProps.ldOptions.resource.kvStores[0];
			if (this.props.ldOptions && nextSingleKV) {
				let prevKVStore = this.props.ldOptions.resource.kvStores[0];
				if (prevKVStore.ldType !== nextSingleKV.ldType) {
					this.determineRenderFn(nextSingleKV.ldType);
				}
			}
			this.setState({ ...this.state, singleKV: nextSingleKV });
		}
	}

	handleChange = (evtval) => {
		console.log("handleChange")
		let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
		let modSingleKV: IKvStore = newLDOptionsObj.resource.kvStores[0];
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKV: modSingleKV });
		//TODO: it might be a good idea to debounce before updating the application state
		//this.props.ldOptions.resource.kvStores = [modSingleKV];

		this.props.notifyLDOptionsChange(newLDOptionsObj);
		//this.setState({...this.state, [name]: value});
	}

	componentWillMount() {
		console.log("cWillMount");
		this.state.singleKV = { ...this.initialKvStores[0] }; //TODO: check, if this can be done with the setState fn. Only needed for determineRenderFn
		//this.setState({ ...this.state, singleKV: this.initialKvStores[0]});
		let baseDT: LDBaseDataType = this.state.singleKV.ldType as LDBaseDataType;
		this.determineRenderFn(baseDT);
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		} else {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				let mountSingleKv: IKvStore = this.props.ldOptions.resource.kvStores[0];
				this.setState({ ...this.state, singleKV: mountSingleKv });
			}
		}
	}
	parseBoolean: any = (inputKv): boolean => {
		if (!inputKv) return false;
		let input = inputKv.value;
		return input === undefined || input === null ? false : input;
	}
	parseText: any = (inputKv): string => {
		if (!inputKv) return "";
		let input = inputKv.value;
		return input ? input : '';
	}
	parseDate: any = (inputKv): Date => {
		if (!inputKv) return new Date();
		let input = inputKv.value;
		return input ? input : new Date();
	}
	parseTime: any = (inputKv): Date => {
		if (!inputKv) return new Date();
		let input = inputKv.value;
		return input ? input : new Date();
	}
	parseNumber: any = (inputKv): number => {
		if (!inputKv) return 0;
		let input = inputKv.value;
		return input ? input : 0;
	}
	parseLabel: any = (inputKv): string => {
		if (!inputKv) return "";
		let input = inputKv.key;
		return input ? input : '';
	}
	private determineRenderFn = (baseDT: LDBaseDataType) => {
		console.log(this.state.singleKV.value);
		switch (baseDT) {
			case LDDict.Boolean:
				this.render = () => {
					let parsedBoolean = this.parseBoolean(this.state.singleKV);
					return <Switch checked={parsedBoolean}
						label={this.parseLabel(this.state.singleKV)}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Integer:
				this.render = () => {
					let parsedNumber = this.parseNumber(this.state.singleKV);
					return <Input type='number'
						label={this.parseLabel(this.state.singleKV)}
						name={this.parseLabel(this.state.singleKV)}
						value={parsedNumber}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Double:
				this.render = () => {
					let parsedNumber = this.parseNumber(this.state.singleKV);
					return <Input type='number'
						label={this.parseLabel(this.state.singleKV)}
						name={this.parseLabel(this.state.singleKV)}
						value={parsedNumber}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Text:
				this.render = () => {
					let parsedText = this.parseText(this.state.singleKV);
					return <Input type='text'
						label={this.parseLabel(this.state.singleKV)}
						name={this.parseLabel(this.state.singleKV)}
						value={parsedText}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Date:
				this.render = () => {
					var parsedDate = this.parseDate(this.state.singleKV);
					return <DatePicker
						label={this.parseLabel(this.state.singleKV)}
						onChange={(evt) => this.handleChange(evt)}
						value={parsedDate}
						sundayFirstDayOfWeek />;
				};
				break;
			case LDDict.DateTime:
				this.render = () => {
					var parsedDate = this.parseDate(this.state.singleKV);
					var parsedTime = this.parseTime(this.state.singleKV);
					return <div>
						<DatePicker
							label={this.parseLabel(this.state.singleKV)}
							onChange={(evt) => this.handleChange(evt)}
							value={parsedDate}
							sundayFirstDayOfWeek />;
						<TimePicker
							label='Time'
							onChange={(evt) => this.handleChange(evt)}
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
export const PureBoolInput = ldBlueprint(bpcfgs[0])(PureBaseDataTypeInput);
export const PureIntInput = ldBlueprint(bpcfgs[1])(PureBaseDataTypeInput);
export const PureDoubleInput = ldBlueprint(bpcfgs[2])(PureBaseDataTypeInput);
export const PureTextInput = ldBlueprint(bpcfgs[3])(PureBaseDataTypeInput);
export const PureDateInput = ldBlueprint(bpcfgs[4])(PureBaseDataTypeInput);
export const PureDateTimeInput = ldBlueprint(bpcfgs[5])(PureBaseDataTypeInput);

export const BooleanValInput = connect(mapStateToProps, mapDispatchToProps)(PureBoolInput);
export const IntegerValInput = connect(mapStateToProps, mapDispatchToProps)(PureIntInput);
export const DoubleValInput = connect(mapStateToProps, mapDispatchToProps)(PureDoubleInput);
export const TextValInput = connect(mapStateToProps, mapDispatchToProps)(PureTextInput);
export const DateValInput = connect(mapStateToProps, mapDispatchToProps)(PureDateInput);
export const DateTimeValInput = connect(mapStateToProps, mapDispatchToProps)(PureDateTimeInput);
