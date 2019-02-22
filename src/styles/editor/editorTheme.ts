import * as mdEditorStyles from './mdEditor.scss';
import * as rdIDs from 'react-toolbox/components/identifiers';
import * as DefaultAppBarTheme from 'react-toolbox/lib/app_bar/';
import * as DefaultButtonTheme from 'react-toolbox/lib/button/';

export const editorTheme = {
  [rdIDs.APP_BAR]: DefaultAppBarTheme,
  [rdIDs.BUTTON]: DefaultButtonTheme,
  [rdIDs.INPUT]: mdEditorStyles,
  [rdIDs.DROPDOWN]: mdEditorStyles,
  [rdIDs.SWITCH]: mdEditorStyles,
  [rdIDs.DRAWER]: mdEditorStyles,
};
