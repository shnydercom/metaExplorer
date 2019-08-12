const proxy = require('http-proxy-middleware');
//const path = require('path');
const mxpIOItpts = require('@metaexplorer-nocode/metaexplorer.io/lib/interpreters.json');
const qrCodeGenScanMod = require('@metaexplorer-mods/qr-code-genscan/server-bom.js');

module.exports = function(app) {
  app.use(proxy('/interpreters', { target: 'http://localhost:7000/' }));
  app.get('/static/interpreters.json', function (req, res) {
    res.send(mxpIOItpts);
    //res.sendFile(path.join(__dirname + '/static/interpreters.json'));
  });
  qrCodeGenScanMod(app);
};
