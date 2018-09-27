import * as mdDesignerStyles from './mdDesigner.scss';
import * as rdIDs from 'react-toolbox/components/identifiers';
import * as DefaultAppBarTheme from 'react-toolbox/lib/app_bar/';
import * as DefaultButtonTheme from 'react-toolbox/lib/button/';

export const designerTheme = {
  [rdIDs.APP_BAR]: DefaultAppBarTheme,
  [rdIDs.BUTTON]: DefaultButtonTheme,
  [rdIDs.INPUT]: mdDesignerStyles,
  [rdIDs.DROPDOWN]: mdDesignerStyles,
  [rdIDs.SWITCH]: mdDesignerStyles,
};
