const path = require('path');
const qrCodeGenScanMod = require('@metaexplorer-mods/qr-code-genscan/lib/server-bom.js');
let staticItpts = {};
try {
  staticItpts = require('@metaexplorer-nocode/metaexplorer.io/lib/interpreters.json');
} catch (error) {
  console.warn("couldn't find interpreters.json. Have you built the nocode-project?");
}

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
