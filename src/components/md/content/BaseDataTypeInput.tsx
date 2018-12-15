import assertNever from "assert-never";
import { connect } from 'react-redux';

import { Input, InputTheme } from 'react-toolbox/lib/input';
import { DatePicker, DatePickerTheme } from 'react-toolbox/lib/date_picker';
import { Switch } from 'react-toolbox/lib/switch';
import { TimePicker, TimePickerTheme } from 'react-toolbox/lib/time_picker';

import { BlueprintConfig, OutputKVMap } from 'ldaccess/ldBlueprint';
import ldBlueprint, { IBlueprintItpt } from 'ldaccess/ldBlueprint';
import { ILDOptions } from 'ldaccess/ildoptions';

import { IKvStore } from 'ldaccess/ikvstore';
import { LDDict } from 'ldaccess/LDDict';

import { LDBaseDataType } from 'ldaccess/LDBaseDataType';
import { LDOwnProps, LDConnectedState, LDConnectedDispatch, LDLocalState } from "appstate/LDProps";
import { mapStateToProps, mapDispatchToProps } from "appstate/reduxFns";
import { ldOptionsDeepCopy } from "ldaccess/ldUtils";
import { Component, ComponentClass, StatelessComponent } from "react";
import { UserDefDict } from "ldaccess/UserDefDict";
import { getKVStoreByKey } from "ldaccess/kvConvenienceFns";
import { gdsfpLD, initLDLocalState, determineSingleKVKey } from "../../generic/generatorFns";
import { parseDate, parseTime, parseText, parseNumber, parseBoolean } from "ldaccess/ldtypesystem/parseSimple";

/**
 * @author Jonathan Schneider
 * for each Base Data Type an itpt is being configured, the React-Part
 * of the itpt is the same for all Base Data Types
 */

type OwnProps = {
	//singleKV: IKvStore; //TODO: doesn't seem to be used any more as react-prop
} & LDOwnProps;

type BaseDataTypeState = {
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
			nameSelf: "shnyder/md/" + elem,
			initialKvStores: initialKVStores,
			interpretableKeys: cfgIntrprtKeys,
			crudSkills: "CRUd"
		};
		bpcfgs.push(bpCfg);
	}
}
class PureBaseDataTypeInput extends Component<LDConnectedState & LDConnectedDispatch & OwnProps, BaseDataTypeState & LDLocalState>
	implements IBlueprintItpt {

	cfg: BlueprintConfig;
	//outputKVMap: OutputKVMap;
	initialKvStores: IKvStore[];

	constructor(props?: LDConnectedState & LDConnectedDispatch & OwnProps) {
		super(props);
		this.cfg = this.constructor["cfg"];
		//this.render = () => null;
		let bdtState: BaseDataTypeState = {
			singleKV: null,
			singleKVKey: UserDefDict.singleKvStore
		};
		this.state = {
			...bdtState,
			...initLDLocalState(
				this.cfg, props,
				[],
				[LDDict.description, UserDefDict.singleKvStore, UserDefDict.outputKVMapKey])
		};
		this.state = {
			...this.state, singleKV:
			{
				key: this.state.singleKVKey,
				value: this.state.localValues.get(this.state.singleKVKey),
				ldType: this.state.localLDTypes.get(this.state.singleKVKey)
			}
		};
	}

	consumeLDOptions = (ldOptions: ILDOptions) => {
		return;
	}

	/*componentWillReceiveProps(nextProps, nextContext): void {
		if (compNeedsUpdate(nextProps, this.props)) {
			this.handleKVs(nextProps);
		}
	}*/

	handleChange = (evtval) => {
		//let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
		let singleKey: string = this.state.singleKVKey;
		let modSingleKV: IKvStore = {
			key: this.state.singleKVKey,
			ldType: this.state.localLDTypes.get(singleKey),
			value: this.state.localValues.get(singleKey)
		};
		//getKVStoreByKey(newLDOptionsObj.resource.kvStores, this.state.singleKVKey);
		modSingleKV.value = evtval;
		this.setState({ ...this.state, singleKV: modSingleKV });
		//TODO: it might be a good idea to debounce before updating the application state
		const outputKVMap = this.state.localValues.get(UserDefDict.outputKVMapKey);
		if (!outputKVMap || !outputKVMap[this.state.singleKVKey]) return;
		this.props.dispatchKvOutput([modSingleKV], this.props.ldTokenString, outputKVMap);
	}

	componentDidMount() {
		/*let initialSingleKV = { ...getKVStoreByKey(this.initialKvStores, this.state.singleKVKey) };
		let baseDT: LDBaseDataType = initialSingleKV.ldType as LDBaseDataType;
		this.determineRenderFn(baseDT);*/
		if (!this.state.singleKV || !this.state.singleKV.ldType) {
			console.log('PureBaseDataTypeInput notifyLDOptionsChange');
			//this self-creates an object. Used e.g. in the itpt-designer, bdt-part
			console.dir(this.props.ldOptions);
			if (this.props.ldOptions) {
				let newLDOptionsObj = ldOptionsDeepCopy(this.props.ldOptions);
				let kvStoreIdx = newLDOptionsObj.resource.kvStores.findIndex((a) => {
					return UserDefDict.singleKvStore.toString() === a.key;
				});
				let singleKv: IKvStore;
				if (kvStoreIdx === -1) {
					singleKv = { key: UserDefDict.singleKvStore, value: null, ldType: this.cfg.canInterpretType };
					newLDOptionsObj.resource.kvStores.push(singleKv);
					this.props.notifyLDOptionsChange(newLDOptionsObj);
				}
				/*else {
					singleKv = newLDOptionsObj.resource.kvStores[kvStoreIdx];
				}*/
			} else {
				this.props.notifyLDOptionsChange(null);
			}
		}/* else {
			if (this.props.ldOptions.resource.kvStores.length > 0) {
				this.handleKVs(this.props);
			}
		}*/
	}
	render() {
		return <>{this.renderSingleKv(this.cfg.canInterpretType as LDBaseDataType)}</>;
	}
	/*private handleKVs(props: LDOwnProps & LDConnectedState) {
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
	}*/

	private renderSingleKv(baseDT: LDBaseDataType) {
		const heading = this.state.localValues.get(LDDict.description);
		switch (baseDT) {
			case LDDict.Boolean:
				let parsedBoolean = parseBoolean(this.state.singleKV);
				return <Switch checked={parsedBoolean}
					label={heading}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Integer:
				const parsedInt = parseNumber(this.state.singleKV);
				return <Input type='number'
					label={heading}
					name={heading}
					value={parsedInt}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Double:
				const parsedDouble = parseNumber(this.state.singleKV);
				return <Input type='number'
					label={heading}
					name={heading}
					value={parsedDouble}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Text:
				let parsedText = parseText(this.state.singleKV);
				return <Input type='text'
					label={heading}
					name={heading}
					value={parsedText}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Date:
				var parsedDate = parseDate(this.state.singleKV);
				return <DatePicker
					label={heading}
					onChange={(evt) => this.handleChange(evt)}
					value={parsedDate}
					sundayFirstDayOfWeek />;
			case LDDict.DateTime:
				var parsedDate = parseDate(this.state.singleKV);
				var parsedTime = parseTime(this.state.singleKV);
				return <div className="dateTimePicker">
					<DatePicker
						label={heading}
						onChange={(evt) => this.handleChange(evt)}
						value={parsedDate}
						sundayFirstDayOfWeek />
					<TimePicker
						label='Time'
						onChange={(evt) => this.handleChange(evt)}
						value={parsedTime}
					/></div>;
			default:
				return assertNever(baseDT);
		}
	}
}
function wrapGDSF(cfg: BlueprintConfig) {
	return (
		nextProps: LDConnectedState & LDConnectedDispatch & OwnProps,
		prevState: BaseDataTypeState & LDLocalState) => {
		let rvLD = gdsfpLD(nextProps, prevState, [], [LDDict.description, UserDefDict.singleKvStore, UserDefDict.outputKVMapKey], cfg.canInterpretType);
		if (!rvLD) return null;
		let rvLocal: BaseDataTypeState = null;
		if (nextProps.ldOptions) {
			let pLdOpts: ILDOptions = nextProps.ldOptions;
			let newSingleKVKey: string = determineSingleKVKey(pLdOpts.resource.kvStores, cfg.canInterpretType, cfg.interpretableKeys as string[]);
			let nextDescription = rvLD.localValues.get(LDDict.description);
			let nextSingleKV = getKVStoreByKey(pLdOpts.resource.kvStores, newSingleKVKey);
			if (!nextSingleKV) {
				//this happens when state changes let this comp re-evaluate before it's being replaced. Do nothing
				return null;
			}
			let desc = nextDescription ? nextDescription : newSingleKVKey;
			rvLD.localLDTypes.set(newSingleKVKey, nextSingleKV.ldType);
			rvLD.localValues.set(newSingleKVKey, nextSingleKV.value);
			rvLD.localLDTypes.set(LDDict.description, LDDict.Text);
			rvLD.localValues.set(LDDict.description, desc);
			rvLocal = { singleKV: nextSingleKV, singleKVKey: newSingleKVKey };
		}
		if (!rvLocal) return null;
		return { ...prevState, ...rvLD, ...rvLocal };
	};
}
class PureBoolBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[0]);
}
class PureIntBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[1]);
}
class PureDoubleBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[2]);
}
class PureTextBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[3]);
}
class PureDateBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[4]);
}
class PureDateTimeBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapGDSF(bpcfgs[5]);
}
//this is the same as using a decorator function on individual classes
export const PureBoolInput = ldBlueprint(bpcfgs[0])(PureBoolBase);
export const PureIntInput = ldBlueprint(bpcfgs[1])(PureIntBase);
export const PureDoubleInput = ldBlueprint(bpcfgs[2])(PureDoubleBase);
export const PureTextInput = ldBlueprint(bpcfgs[3])(PureTextBase);
export const PureDateInput = ldBlueprint(bpcfgs[4])(PureDateBase);
export const PureDateTimeInput = ldBlueprint(bpcfgs[5])(PureDateTimeBase);

export const BooleanValInput = connect(mapStateToProps, mapDispatchToProps)(PureBoolInput);
export const IntegerValInput = connect(mapStateToProps, mapDispatchToProps)(PureIntInput);
export const DoubleValInput = connect(mapStateToProps, mapDispatchToProps)(PureDoubleInput);
export const TextValInput = connect(mapStateToProps, mapDispatchToProps)(PureTextInput);
export const DateValInput = connect(mapStateToProps, mapDispatchToProps)(PureDateInput);
export const DateTimeValInput = connect(mapStateToProps, mapDispatchToProps)(PureDateTimeInput);
