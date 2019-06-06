import assertNever from "assert-never";
import { AbstractBaseDataTypeInput, wrapBaseDataTypeGDSF, baseDataTypeBpcfgs } from "components/md/content/AbstractBaseDataTypeInput";
import { LDBaseDataType } from "ldaccess/LDBaseDataType";
import ldBlueprint from "ldaccess/ldBlueprint";
import { parseDate, parseTime, parseText, parseNumber, parseBoolean } from "ldaccess/ldtypesystem/parseSimple";
import { LDDict } from "ldaccess/LDDict";
import { Switch, Input, Grid, TextField, } from "@material-ui/core";

import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';

abstract class PureBaseDataTypeInput extends AbstractBaseDataTypeInput {
	renderSingleKv(baseDT: LDBaseDataType) {
		const heading = this.state.localValues.get(LDDict.description);
		switch (baseDT) {
			case LDDict.Boolean:
				let parsedBoolean = parseBoolean(this.state.singleKVOutput);
				return <Switch checked={parsedBoolean}
					label={heading}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Integer:
				const parsedInt = parseNumber(this.state.singleKVOutput);
				return <Input type='number'
					label={heading}
					name={heading}
					value={parsedInt}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Double:
				const parsedDouble = parseNumber(this.state.singleKVOutput);
				return <Input type='number'
					label={heading}
					name={heading}
					value={parsedDouble}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Text:
				let parsedText = parseText(this.state.singleKVOutput);
				return <Input type='text'
					label={heading}
					name={heading}
					value={parsedText}
					onChange={(evt) => this.handleChange(evt)} />;
			case LDDict.Date:
				var parsedDate = parseDate(this.state.singleKVOutput);
				return <TextField
					id="date"
					label="Birthday"
					type="date"
					defaultValue={parsedDate}
					InputLabelProps={{
						shrink: true,
					}}
				/>;
			/*<DatePicker
				label={heading}
				onChange={(evt) => this.handleChange(evt)}
				value={parsedDate}
	sundayFirstDayOfWeek />*/
			case LDDict.DateTime:
				var parsedDate = parseDate(this.state.singleKVOutput);
				var parsedTime = parseTime(this.state.singleKVOutput);
				return <div className="dateTimePicker">
					<TextField
						id="datetime-local"
						label="Next appointment"
						type="datetime-local"
						defaultValue="2017-05-24T10:30"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					{/*
					<DatePicker
						label={heading}
						onChange={(evt) => this.handleChange(evt)}
						value={parsedDate}
						sundayFirstDayOfWeek />
					<TimePicker
						label='Time'
						onChange={(evt) => this.handleChange(evt)}
						value={parsedTime}
					/>*/
					}
				</div>;
			default:
				return assertNever(baseDT);
		}
	}
}
class PureBoolBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[0]);
}
class PureIntBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[1]);
}
class PureDoubleBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[2]);
}
class PureTextBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[3]);
}
class PureDateBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[4]);
}
class PureDateTimeBase extends PureBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(baseDataTypeBpcfgs[5]);
}

export const MaterialDesignBoolInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureBoolBase);
export const MaterialDesignIntInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureIntBase);
export const MaterialDesignDoubleInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureDoubleBase);
export const MaterialDesignTextInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureTextBase);
export const MaterialDesignDateInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureDateBase);
export const MaterialDesignDateTimeInput = ldBlueprint(baseDataTypeBpcfgs[0])(PureDateTimeBase);
