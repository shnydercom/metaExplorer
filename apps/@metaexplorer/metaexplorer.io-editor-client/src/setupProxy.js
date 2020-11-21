const proxy = require('http-proxy-middleware');
const path = require('path');
const mxpIOItpts = require('@metaexplorer-nocode/metaexplorer.io/lib/interpreters.json');
const qrCodeGenScanMod = require('@metaexplorer-mods/qr-code-genscan/server-bom.js');

const itptEditorMod = require('@metaexplorer-mods/itpt-editor/lib/server-bom');

module.exports = function (app) {
  itptEditorMod(app);
  qrCodeGenScanMod(app);
  if (process.env.MIO_DYNAMIC) {
    app.use(proxy('/api-static/interpreters.json', {
      target: 'http://localhost:5000/api/blocks', pathRewrite: {
        '^/api-static/interpreters.json': ''
      }
    }));
    app.use(proxy('/api/blocks', { target: 'http://localhost:5000/' }));
    app.use(proxy('/api/globals', { target: 'http://localhost:5000/' }));
    
    app.use(proxy('/styles/*', { target: 'http://localhost:5000/styles/' /*, pathRewrite: { '^/styles': '' } */}));
  } else {
    //only statically retrieving the interpreters in dev
    app.get('/api-static/interpreters.json', function (req, res) {
      res.send(mxpIOItpts);
    });
    app.post('/api/blocks', function (req, res) {
      res.sendStatus(405);
    });
  }
  app.get('/media/*', function (req, res) {
    const noMediaPath = req.path.replace('/media/', '');
    res.sendFile(path.join(__dirname, './../assets/', noMediaPath));
  });
};
