const webpackCfgCreator = require("@metaexplorer/testing/lib/storybook/webpack.config")

const webpackCfg = webpackCfgCreator.createWebpackConfig(__dirname);

module.exports = webpackCfg