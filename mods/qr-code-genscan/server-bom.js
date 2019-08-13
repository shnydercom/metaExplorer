// a bill of materials so that our dev-server or express can pick it up

//const path = require('path');

const qrcodeGen = require.resolve('qrcode-generator/qrcode.js');
const qrcodeScan = require.resolve('qr-scanner/qr-scanner.min.js');
const qrcodeScanWorker = require.resolve('qr-scanner/qr-scanner-worker.min.js');
const quagga = require.resolve('quagga/dist/quagga.min.js');

module.exports = function(app) {
  app.get('/lib/qrcode-generator@1.4.3.js', function (req, res) {
    res.sendFile(qrcodeGen);
	});
	app.get('/lib/qr-scanner@1.1.1.js', function (req, res) {
    res.sendFile(qrcodeScan);
	});
	app.get('/lib/qr-scanner-worker.min.js@1.1.1.js', function (req, res) {
    res.sendFile(qrcodeScanWorker);
  });
  app.get('/lib/quagga@0.12.1.js', function (req, res) {
    res.sendFile(quagga);
  });
};