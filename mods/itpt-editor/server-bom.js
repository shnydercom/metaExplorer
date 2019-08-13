// a bill of materials so that our dev-server or express can pick it up

const editorAsset1 = require.resolve('metaexplorer-react-components/assets/static/phone-preview.png');
const editorAsset2 = require.resolve('metaexplorer-react-components/assets/static/minimize.svg');
const editorAsset3 = require.resolve('metaexplorer-react-components/assets/static/maximize.svg');
const editorAsset4 = require.resolve('metaexplorer-react-components/assets/static/up.svg');
const editorAsset5 = require.resolve('metaexplorer-react-components/assets/static/move.svg');
const editorAsset6 = require.resolve('metaexplorer-react-components/assets/static/watch-preview.png');

module.exports = function (app) {
  app.get('/static/phone-preview.png', function (req, res) {
    res.sendFile(editorAsset1);
  });
  app.get('/static/minimize.svg', function (req, res) {
    res.sendFile(editorAsset2);
  });
  app.get('/static/maximize.svg', function (req, res) {
    res.sendFile(editorAsset3);
  });
  app.get('/static/up.svg', function (req, res) {
    res.sendFile(editorAsset4);
  });
  app.get('/static/move.svg', function (req, res) {
    res.sendFile(editorAsset5);
  });
  app.get('/static/watch-preview.png', function (req, res) {
    res.sendFile(editorAsset6);
  });
};