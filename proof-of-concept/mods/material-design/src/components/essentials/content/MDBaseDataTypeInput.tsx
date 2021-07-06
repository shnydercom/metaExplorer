import {
	AbstractBaseDataTypeInput, wrapBaseDataTypeGDSF, baseDataTypeBpcfgs, LDBaseDataType, ldBlueprint,
	parseDate, parseText, parseNumber, parseBoolean, LDDict, LD_BASE_DATA_TYPE_INPUT_TYPES
} from "@metaexplorer/core";
import { Switch, TextField, FormControlLabel } from "@material-ui/core";
import React from "react";
import { createMDModNSUrl } from "../../../utils/mdUtils";

const mdBaseDataTypeBpcfgs = baseDataTypeBpcfgs.map((cfg, idx) => {
	return { ...cfg, nameSelf: createMDModNSUrl(LD_BASE_DATA_TYPE_INPUT_TYPES[idx]) };
});

abstract class MDBaseDataTypeInput extends AbstractBaseDataTypeInput {
	renderSingleKv(baseDT: LDBaseDataType) {
		const heading = this.state.localValues.get(LDDict.description);
		switch (baseDT) {
			case LDDict.Boolean:
				let parsedBoolean = parseBoolean(this.state.singleKVInput);
				return <FormControlLabel
					control={<Switch checked={parsedBoolean}
						onChange={(evt) => this.handleChange(evt.target.checked)} />
					}
					label={heading}
				/>;
			case LDDict.Integer:
				const parsedInt = parseNumber(this.state.singleKVInput);
				return <TextField type='number'
					label={heading}
					name={heading}
					value={parsedInt}
					onChange={(evt) => this.handleChange(evt.currentTarget.value)} />;
			case LDDict.Double:
				const parsedDouble = parseNumber(this.state.singleKVInput);
				return <TextField type='number'
					label={heading}
					name={heading}
					value={parsedDouble}
					onChange={(evt) => this.handleChange(evt.currentTarget.value)} />;
			case LDDict.Text:
				let parsedText = parseText(this.state.singleKVInput);
				return <TextField type='text'
					label={heading}
					name={heading}
					value={parsedText}
					onChange={(evt) => this.handleChange(evt.currentTarget.value)} />;
			case LDDict.Date:
				var parsedDate = parseDate(this.state.singleKVInput);
				return <TextField
					id="date"
					label={heading}
					type="date"
					defaultValue={parsedDate}
					InputLabelProps={{
						shrink: true,
					}}
				/>;
			/*<DatePicker
				label={heading}
				onChange={(evt) => this.handleChange(evt.currentTarget.value)}
				value={parsedDate}
	sundayFirstDayOfWeek />*/
			case LDDict.DateTime:
				var parsedDate = parseDate(this.state.singleKVInput);
				//var parsedTime = parseTime(this.state.singleKVOutput);
				return <div className="dateTimePicker">
					<TextField
						id="datetime-local"
						label={heading}
						type="datetime-local"
						defaultValue="2017-05-24T10:30"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					{/*
					<DatePicker
						label={heading}
						onChange={(evt) => this.handleChange(evt.currentTarget.value)}
						value={parsedDate}
						sundayFirstDayOfWeek />
					<TimePicker
						label='Time'
						onChange={(evt) => this.handleChange(evt.currentTarget.value)}
						value={parsedTime}
					/>*/
					}
				</div>;
			default:
				return null;
		}
	}
}
class PureBoolBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[0]);
}
class PureIntBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[1]);
}
class PureDoubleBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[2]);
}
class PureTextBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[3]);
}
class PureDateBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[4]);
}
class PureDateTimeBase extends MDBaseDataTypeInput {
	static getDerivedStateFromProps = wrapBaseDataTypeGDSF(mdBaseDataTypeBpcfgs[5]);
}

export const MDBoolInput = ldBlueprint(mdBaseDataTypeBpcfgs[0])(PureBoolBase);
export const MDIntInput = ldBlueprint(mdBaseDataTypeBpcfgs[1])(PureIntBase);
export const MDDoubleInput = ldBlueprint(mdBaseDataTypeBpcfgs[2])(PureDoubleBase);
export const MDTextInput = ldBlueprint(mdBaseDataTypeBpcfgs[3])(PureTextBase);
export const MDDateInput = ldBlueprint(mdBaseDataTypeBpcfgs[4])(PureDateBase);
export const MDDateTimeInput = ldBlueprint(mdBaseDataTypeBpcfgs[5])(PureDateTimeBase);
