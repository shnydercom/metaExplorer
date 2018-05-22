import assertNever from "assert-never";
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
import { ldOptionsDeepCopy, getKVValue } from "ldaccess/ldUtils";
import { Component, ComponentClass, StatelessComponent } from "react";
import { UserDefDict } from "ldaccess/UserDefDict";
import { getKVStoreByKey, getKVStoreByKeyFromLDOptionsOrCfg } from "ldaccess/kvConvenienceFns";
import { compNeedsUpdate } from "../reactUtils/compUtilFns";

/**
 * @author Jonathan Schneider
 * for each Base Data Type an interpreter is being configured, the React-Part
 * of the interpreter is the same for all Base Data Types
 */

type OwnProps = {
	singleKV: IKvStore;
} & LDOwnProps;

type BaseDataTypeState = {
	heading: string,
	singleKV: IKvStore,
	singleKVKey: string
};

let bdts: LDBaseDataType[] = [LDDict.Boolean, LDDict.Integer, LDDict.Double, LDDict.Text, LDDict.Date, LDDict.DateTime];
let bpcfgs: BlueprintConfig[] = new Array();

for (var bdt in bdts) {
	if (bdts.hasOwnProperty(bdt)) {
		var elem = bdts[bdt];
		//let cfgType: string = LDDict.CreateAction;
		let cfgIntrprtKeys: string[] = [LDDict.description, UserDefDict.singleKvStore];
		let initialKVStores: IKvStore[] = [
			{
				key: LDDict.description,
				value: undefined,
				ldType: LDDict.Text
			},
			{//if singleKvStore is not used explicitly, BaseDataTypeInput tries to determine the key dynamically
				key: UserDefDict.singleKvStore,
				value: undefined,
				ldType: elem
			},
			{//one for output, gets ignored
				key: UserDefDict.singleKvStore,
				value: undefined,
				ldType: elem
			},
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
class PureBaseDataTypeInput extends Component<LDConnectedState & LDConnectedDispatch & OwnProps, BaseDataTypeState>
	implements IBlueprintItpt {
	cfg: BlueprintConfig;
	outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];

	constructor(props?: LDConnectedState & LDConnectedDispatch & OwnProps) {
		super(props);
		this.cfg = this.constructor["cfg"];
		this.render = () => null;
		this.state = {
			heading: "",
			singleKV: null,
			singleKVKey: UserDefDict.singleKvStore
		};
	}
	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	componentWillReceiveProps(nextProps, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}

	handleChange = (evtval) => {
		let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
		let modSingleKV: IKvStore = getKVStoreByKey(newLDOptionsObj.resource.kvStores, this.state.singleKVKey);
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKV: modSingleKV });
		//TODO: it might be a good idea to debounce before updating the application state
		this.props.dispatchKvOutput([modSingleKV], this.props.ldTokenString, this.outputKVMap);
	}

	componentWillMount() {
		let initialSingleKV = { ...getKVStoreByKey(this.initialKvStores, this.state.singleKVKey) };
		let baseDT: LDBaseDataType = initialSingleKV.ldType as LDBaseDataType;
		this.determineRenderFn(baseDT);
		if (!this.props.ldOptions) {
			this.props.notifyLDOptionsChange(null);
		} else {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				this.handleKVs(this.props);
			}
		}
	}
	parseBoolean = (inputKv): boolean => {
		if (!inputKv) return false;
		let input = inputKv.value;
		return input === undefined || input === null ? false : input;
	}
	parseText = (inputKv): string => {
		if (!inputKv) return "";
		let input = inputKv.value;
		return input ? input : '';
	}
	parseDate = (inputKv): Date => {
		if (!inputKv) return new Date();
		let input = inputKv.value;
		return input ? input : new Date();
	}
	parseTime = (inputKv): Date => {
		if (!inputKv) return new Date();
		let input = inputKv.value;
		return input ? input : new Date();
	}
	parseNumber = (inputKv): number => {
		if (!inputKv) return 0;
		let input = inputKv.value;
		return input ? input : 0;
	}
	parseLabel = (inputKv, descrKv: IKvStore): string => {
		if (descrKv) {
			if (descrKv.ldType === LDDict.Text && descrKv.value !== null && descrKv.value !== undefined) {
				return descrKv.value;
			}
		}
		if (!inputKv) return "";
		let input = inputKv.key;
		return input ? input : '';
	}

	private handleKVs(props: LDOwnProps & LDConnectedState) {
		if (props.ldOptions) {
			let pLdOpts: ILDOptions = props && props.ldOptions && props.ldOptions ? props.ldOptions : null;
			let newSingleKVKey: string = this.determineSingleKVKey(pLdOpts.resource.kvStores);
			let nextDescription = getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, LDDict.description);
			let nextSingleKV = getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, newSingleKVKey);
			if (this.props.ldOptions && nextSingleKV) {
				let prevKVStore = getKVStoreByKey(this.props.ldOptions.resource.kvStores, newSingleKVKey);
				if ((!prevKVStore && nextSingleKV) || prevKVStore.ldType !== nextSingleKV.ldType) {
					this.determineRenderFn(nextSingleKV.ldType as LDBaseDataType);
				}
			}
			this.outputKVMap = getKVValue(getKVStoreByKeyFromLDOptionsOrCfg(pLdOpts, this.cfg, UserDefDict.outputKVMapKey));
			let desc = this.parseLabel(nextSingleKV, nextDescription);
			this.setState({ ...this.state, singleKV: nextSingleKV, heading: desc, singleKVKey: newSingleKVKey });
		}
	}

	private determineSingleKVKey(kvStores: IKvStore[]): string {
		let rv: string = UserDefDict.singleKvStore;
		let candidates: IKvStore[] = [];
		if (kvStores) {
			for (let idx = 0; idx < kvStores.length; idx++) {
				const a = kvStores[idx];
				if (a.key === UserDefDict.singleKvStore) return rv;
				if (a.key === UserDefDict.outputKVMapKey) continue;
				if (kvStores[idx].ldType === this.cfg.canInterpretType) {
					candidates.push(kvStores[idx]);
				}
			}
		}
		if (candidates.length === 1) {
			rv = candidates[0].key as string;
		} else {
			candidates.filter((a) => !this.cfg.interpretableKeys.includes(a.key));
			rv = candidates.length > 0 ? candidates[0].key : rv;
		}
		return rv;
	}

	private determineRenderFn = (baseDT: LDBaseDataType) => {
		switch (baseDT) {
			case LDDict.Boolean:
				this.render = () => {
					const { heading } = this.state;
					let parsedBoolean = this.parseBoolean(this.state.singleKV);
					return <Switch checked={parsedBoolean}
						label={heading}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Integer:
				this.render = () => {
					const { heading } = this.state;
					let parsedNumber = this.parseNumber(this.state.singleKV);
					return <Input type='number'
						label={heading}
						name={heading}
						value={parsedNumber}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Double:
				this.render = () => {
					const { heading } = this.state;
					let parsedNumber = this.parseNumber(this.state.singleKV);
					return <Input type='number'
						label={heading}
						name={heading}
						value={parsedNumber}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Text:
				this.render = () => {
					const { heading } = this.state;
					let parsedText = this.parseText(this.state.singleKV);
					return <Input type='text'
						label={heading}
						name={heading}
						value={parsedText}
						onChange={(evt) => this.handleChange(evt)} />;
				};
				break;
			case LDDict.Date:
				this.render = () => {
					const { heading } = this.state;
					var parsedDate = this.parseDate(this.state.singleKV);
					return <DatePicker
						label={heading}
						onChange={(evt) => this.handleChange(evt)}
						value={parsedDate}
						sundayFirstDayOfWeek />;
				};
				break;
			case LDDict.DateTime:
				this.render = () => {
					const { heading } = this.state;
					var parsedDate = this.parseDate(this.state.singleKV);
					var parsedTime = this.parseTime(this.state.singleKV);
					return <div>
						<DatePicker
							label={heading}
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
