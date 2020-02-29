const storybookCfg = require("@metaexplorer/testing/lib/storybook/config");

const req = require.context('../src', true, /\.story\.(ts|tsx)$/);
storybookCfg.createStoryBookConfig(req);
