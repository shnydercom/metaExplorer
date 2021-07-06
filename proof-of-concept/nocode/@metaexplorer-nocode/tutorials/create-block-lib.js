const mxpDevServer = require('@metaexplorer/editor-dev-server');
const mainItpt = "landing/index";// "metaexplorer.io/v1/connected-editor";//"metaexplorer.io/v2/index"
mxpDevServer.createBlocksFromLib(mainItpt, "blocks");