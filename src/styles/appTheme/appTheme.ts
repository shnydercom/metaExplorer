import * as appBarTheme from './appBarTheme.scss';
import * as rdIDs from 'react-toolbox/components/identifiers';
//configuration names for React-Toolbox from react-css-themr, found in react-toolbox/src/components/identifiers.js

import * as DefaultInputTheme from 'react-toolbox/lib/input/theme.css';
import * as DefaultDropdownTheme from 'react-toolbox/lib/dropdown/theme.css';
import * as DefaultSwitchTheme from 'react-toolbox/lib/switch/theme.css';
import * as DefaultRippleTheme from 'react-toolbox/lib/ripple/theme.css';
import * as DefaultButtonTheme from 'react-toolbox/lib/button/theme.css';
import * as DefaultLayoutTheme from 'react-toolbox/lib/layout/theme.css';

export const appTheme = {
	[rdIDs.RIPPLE]: DefaultRippleTheme,
	[rdIDs.BUTTON]: DefaultButtonTheme,
	[rdIDs.APP_BAR]: appBarTheme,
	[rdIDs.INPUT]: DefaultInputTheme,
  [rdIDs.DROPDOWN]: DefaultDropdownTheme,
	[rdIDs.SWITCH]: DefaultSwitchTheme,
	[rdIDs.LAYOUT]: DefaultLayoutTheme,
};
