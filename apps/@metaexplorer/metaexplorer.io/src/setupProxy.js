const path = require('path');
const staticItpts = require('@metaexplorer-nocode/metaexplorer.io/lib/interpreters.json');
const qrCodeGenScanMod = require('@metaexplorer-mods/qr-code-genscan/server-bom.js');

module.exports = function (app) {
  qrCodeGenScanMod(app);
  app.get('/api-static/interpreters.json', function (req, res) {
    res.send(staticItpts);
  });
  app.get('/media/*', function (req, res) {
    const noMediaPath = req.path.replace('/media/', '');
    res.sendFile(path.join(__dirname, './../assets/', noMediaPath));
  });
};
